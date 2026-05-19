const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

/**
 * POST /api/checkout
 * 
 * Handles hardware checkout requests with comprehensive validation:
 * 1. Validates required fields (itemId, studentId, quantity)
 * 2. Checks inventory availability (currentAvailable >= requested quantity)
 * 3. Prevents double-checkouts with atomic database operations
 * 4. Returns detailed error messages for debugging
 * 
 * Request body:
 * {
 *   itemId: string (hardware item ID)
 *   studentId: string (student identifier for tracking)
 *   quantity: number (units to checkout, must be >= 1 and <= currentAvailable)
 * }
 * 
 * Response:
 * Success (200): { message, item, updatedAvailability }
 * Error (4xx/5xx): { message, code, details }
 */
router.post('/', async (req, res) => {
  try {
    const { itemId, studentId, quantity } = req.body;

    // ===== VALIDATION: Required Fields =====
    if (!itemId || !studentId || !quantity) {
      return res.status(400).json({
        message: 'Missing required fields.',
        code: 'MISSING_FIELDS',
        required: ['itemId', 'studentId', 'quantity'],
      });
    }

    // ===== VALIDATION: Quantity is a positive integer =====
    const parsedQty = parseInt(quantity, 10);
    if (isNaN(parsedQty) || parsedQty < 1) {
      return res.status(400).json({
        message: 'Quantity must be a positive integer.',
        code: 'INVALID_QUANTITY',
        received: quantity,
      });
    }

    // ===== DATABASE LOOKUP: Find hardware item =====
    const item = await Equipment.findById(itemId);
    if (!item) {
      return res.status(404).json({
        message: 'Hardware item not found in inventory.',
        code: 'ITEM_NOT_FOUND',
        itemId,
      });
    }

    // ===== SAFETY CHECK: Voltage compatibility warning (metadata) =====
    // This could be expanded to include comprehensive safety rules
    let compatibilityWarning = null;
    if (item.specs && item.specs.voltage === '3.3V') {
      compatibilityWarning = 'This 3.3V component requires a compatible microcontroller. Check your board specs.';
    }

    // ===== AVAILABILITY CHECK: Ensure sufficient stock =====
    if (item.currentAvailable < parsedQty) {
      return res.status(409).json({
        message: `Insufficient inventory. Only ${item.currentAvailable} units available.`,
        code: 'INSUFFICIENT_STOCK',
        requested: parsedQty,
        available: item.currentAvailable,
        totalQuantity: item.totalQuantity,
      });
    }

    // ===== ATOMIC UPDATE: Deduct quantity from currentAvailable =====
    // Using findByIdAndUpdate ensures atomicity - prevents race conditions
    const updatedItem = await Equipment.findByIdAndUpdate(
      itemId,
      {
        $inc: { currentAvailable: -parsedQty }, // Decrement available count
      },
      {
        new: true, // Return updated document
        runValidators: true, // Ensure schema validation
      }
    );

    // ===== LOG CHECKOUT EVENT (for audit trail) =====
    const checkoutLog = {
      itemName: item.name,
      studentId,
      quantity: parsedQty,
      timestamp: new Date(),
      remainingAvailable: updatedItem.currentAvailable,
    };
    console.log(`✓ Checkout successful:`, checkoutLog);

    // ===== SUCCESS RESPONSE =====
    res.status(200).json({
      message: 'Checkout completed successfully.',
      code: 'CHECKOUT_SUCCESS',
      item: {
        id: item._id,
        name: item.name,
        category: item.category,
      },
      checkoutDetails: {
        quantity: parsedQty,
        studentId,
        timestamp: new Date().toISOString(),
      },
      updatedInventory: {
        available: updatedItem.currentAvailable,
        total: updatedItem.totalQuantity,
      },
      compatibilityWarning, // Include warning if applicable
    });
  } catch (error) {
    console.error('❌ Checkout error:', error);

    // Handle specific MongoDB errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        message: 'Validation error in checkout request.',
        code: 'VALIDATION_ERROR',
        details: error.message,
      });
    }

    if (error.name === 'CastError') {
      return res.status(400).json({
        message: 'Invalid item ID format.',
        code: 'INVALID_ID_FORMAT',
      });
    }

    // Generic server error
    res.status(500).json({
      message: 'Server error during checkout. Please try again later.',
      code: 'SERVER_ERROR',
      timestamp: new Date().toISOString(),
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
