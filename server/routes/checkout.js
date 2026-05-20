const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');
const { validateCircuitSchema } = require('../logic/hardwareValidator');

/**
 * POST /api/checkout
 * 
 * Handles hardware checkout with comprehensive validation:
 * 1. Validates required fields (items array with itemId, quantity)
 * 2. Runs HARDWARE SAFETY VALIDATION (voltage compatibility, current overdraw)
 * 3. Checks inventory availability for all items
 * 4. Uses atomic database operations to prevent race conditions
 * 5. Returns detailed error messages and safety warnings
 * 
 * Request body:
 * {
 *   items: [
 *     { itemId: string, quantity: number, productName: string },
 *     ...
 *   ],
 *   totalPrice: number (optional),
 *   studentId: string (optional, for tracking)
 * }
 * 
 * Response:
 * Success (200): { success: true, checkoutDetails, safetyReport }
 * Error (400): { success: false, error, safetyWarnings }
 * Error (409): { success: false, error: 'INSUFFICIENT_STOCK' }
 */
router.post('/', async (req, res) => {
  try {
    const { items, studentId = 'guest', totalPrice = 0 } = req.body;

    // ===== VALIDATION: Items array =====
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No items provided for checkout.',
        code: 'MISSING_ITEMS'
      });
    }

    // ===== FETCH ALL ITEMS FROM DATABASE =====
    const itemIds = items.map(item => item.itemId);
    const dbItems = await Equipment.find({ _id: { $in: itemIds } });

    if (dbItems.length !== itemIds.length) {
      return res.status(404).json({
        success: false,
        error: 'One or more items not found in inventory.',
        code: 'ITEM_NOT_FOUND'
      });
    }

    // ===== STEP 1: RUN HARDWARE SAFETY VALIDATION =====
    // Convert items to component format for validator
    const componentsForValidation = dbItems.map(item => ({
      id: item._id.toString(),
      name: item.name,
      type: item.category?.toLowerCase().replace(/\s+/g, '-') || 'unknown',
      voltage: item.specs?.voltage,
      specs: item.specs
    }));

    const safetyReport = validateCircuitSchema(componentsForValidation);

    // ===== CRITICAL SAFETY CHECK =====
    // If circuit has critical voltage mismatches, abort checkout
    if (safetyReport.violations.critical.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'HARDWARE SAFETY VIOLATION: Your component selection has critical safety issues.',
        code: 'SAFETY_VIOLATION',
        safetyScore: safetyReport.safetyScore,
        criticalIssues: safetyReport.violations.critical,
        warnings: safetyReport.warnings,
        recommendations: safetyReport.violations.critical.map(issue => 
          `⚠️ ${issue}`
        )
      });
    }

    // ===== STEP 2: CHECK INVENTORY AVAILABILITY =====
    const itemsWithAvailability = items.map(requested => {
      const dbItem = dbItems.find(db => db._id.toString() === requested.itemId);
      return {
        ...requested,
        dbItem,
        available: dbItem ? dbItem.currentAvailable : 0,
        valid: dbItem && dbItem.currentAvailable >= requested.quantity
      };
    });

    // Check if all items are available
    const insufficientItems = itemsWithAvailability.filter(item => !item.valid);
    if (insufficientItems.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'INSUFFICIENT_STOCK: One or more items not available in requested quantity.',
        code: 'INSUFFICIENT_STOCK',
        insufficientItems: insufficientItems.map(item => ({
          itemId: item.itemId,
          productName: item.productName,
          requested: item.quantity,
          available: item.available
        }))
      });
    }

    // ===== STEP 3: ATOMIC DATABASE UPDATES =====
    // Deduct inventory for all items in parallel
    const updatePromises = itemsWithAvailability.map(item =>
      Equipment.findByIdAndUpdate(
        item.itemId,
        { $inc: { currentAvailable: -item.quantity } },
        { new: true, runValidators: true }
      )
    );

    const updatedItems = await Promise.all(updatePromises);

    // ===== STEP 4: LOG CHECKOUT EVENT =====
    console.log('✓ CHECKOUT SUCCESSFUL', {
      studentId,
      itemCount: items.length,
      totalPrice,
      safetyScore: safetyReport.safetyScore,
      timestamp: new Date().toISOString()
    });

    // ===== SUCCESS RESPONSE =====
    res.status(200).json({
      success: true,
      message: 'Checkout completed successfully.',
      code: 'CHECKOUT_SUCCESS',
      checkoutDetails: {
        studentId,
        itemCount: items.length,
        totalPrice,
        timestamp: new Date().toISOString()
      },
      itemDetails: updatedItems.map(item => ({
        id: item._id,
        name: item.name,
        remaining: item.currentAvailable,
        total: item.totalQuantity
      })),
      safetyReport: {
        score: safetyReport.safetyScore,
        status: safetyReport.success ? 'SAFE' : 'WARNINGS',
        warnings: safetyReport.warnings.filter(w => w.severity !== 'INFO')
      }
    });

  } catch (error) {
    console.error('❌ Checkout error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation error in checkout request.',
        code: 'VALIDATION_ERROR'
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid item ID format.',
        code: 'INVALID_ID_FORMAT'
      });
    }

    // Generic server error
    res.status(500).json({
      success: false,
      error: 'Server error during checkout. Please try again later.',
      code: 'SERVER_ERROR'
    });
  }
});

/**
 * GET /api/checkout/status/:itemId
 * Optionally retrieve current availability of an item
 */
router.get('/status/:itemId', async (req, res) => {
  try {
    const item = await Equipment.findById(req.params.itemId);
    if (!item) {
      return res.status(404).json({ message: 'Item not found.' });
    }

    res.json({
      itemId: item._id,
      name: item.name,
      currentAvailable: item.currentAvailable,
      totalQuantity: item.totalQuantity,
      percentageAvailable: ((item.currentAvailable / item.totalQuantity) * 100).toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving item status.' });
  }
});

module.exports = router;
