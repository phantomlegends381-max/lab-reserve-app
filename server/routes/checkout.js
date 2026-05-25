const express = require('express');
const Equipment = require('../models/Equipment');
const asyncHandler = require('../middleware/asyncHandler');
const { connectDatabase } = require('../config/database');
const { validateCircuitSchema } = require('../logic/hardwareValidator');

const router = express.Router();

router.post('/', asyncHandler(async (req, res) => {
  await connectDatabase();

  const { items, studentId = 'guest', totalPrice = 0 } = req.body;

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No items provided for checkout.',
      code: 'MISSING_ITEMS',
    });
  }

  const itemIds = items.map((item) => item.itemId);
  const dbItems = await Equipment.find({ _id: { $in: itemIds } });

  if (dbItems.length !== itemIds.length) {
    return res.status(404).json({
      success: false,
      error: 'One or more items were not found in inventory.',
      code: 'ITEM_NOT_FOUND',
    });
  }

  const componentsForValidation = dbItems.map((item) => {
    const request = items.find((requested) => requested.itemId === item._id.toString());

    return {
      id: item._id.toString(),
      name: item.name,
      partNumber: item.partNumber,
      quantity: request?.quantity || 1,
      powerSource: item.specs?.requiresExternalPower ? 'external' : undefined,
      externalPower: item.specs?.requiresExternalPower || undefined,
    };
  });

  const safetyReport = validateCircuitSchema({
    projectName: `Checkout request for ${studentId}`,
    components: componentsForValidation,
  });

  const criticalIssues = safetyReport.warnings.filter((warning) => warning.severity === 'critical');
  if (criticalIssues.length > 0) {
    return res.status(400).json({
      success: false,
      error: 'Hardware safety violation. Resolve critical issues before checkout.',
      code: 'SAFETY_VIOLATION',
      safetyScore: safetyReport.circuitSafetyScore,
      criticalIssues,
      warnings: safetyReport.warnings,
      recommendations: criticalIssues.map((issue) => issue.mitigation),
    });
  }

  const itemsWithAvailability = items.map((requested) => {
    const dbItem = dbItems.find((item) => item._id.toString() === requested.itemId);
    const available = dbItem?.currentAvailable ?? dbItem?.quantity ?? 0;

    return {
      ...requested,
      dbItem,
      available,
      valid: dbItem && available >= requested.quantity,
    };
  });

  const insufficientItems = itemsWithAvailability.filter((item) => !item.valid);
  if (insufficientItems.length > 0) {
    return res.status(409).json({
      success: false,
      error: 'One or more items are not available in the requested quantity.',
      code: 'INSUFFICIENT_STOCK',
      insufficientItems: insufficientItems.map((item) => ({
        itemId: item.itemId,
        productName: item.productName || item.dbItem?.name,
        requested: item.quantity,
        available: item.available,
      })),
    });
  }

  const updatedItems = await Promise.all(itemsWithAvailability.map((item) => (
    Equipment.findOneAndUpdate(
      {
        _id: item.itemId,
        currentAvailable: { $gte: item.quantity },
      },
      {
        $inc: {
          currentAvailable: -item.quantity,
          quantity: -item.quantity,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
  )));

  if (updatedItems.some((item) => !item)) {
    return res.status(409).json({
      success: false,
      error: 'Inventory changed while checking out. Please refresh and try again.',
      code: 'CHECKOUT_RACE_CONDITION',
    });
  }

  return res.status(200).json({
    success: true,
    message: 'Checkout completed successfully.',
    code: 'CHECKOUT_SUCCESS',
    checkoutDetails: {
      studentId,
      itemCount: items.length,
      totalPrice,
      timestamp: new Date().toISOString(),
    },
    itemDetails: updatedItems.map((item) => ({
      id: item._id,
      name: item.name,
      remaining: item.currentAvailable,
      total: item.totalQuantity,
    })),
    safetyReport: {
      score: safetyReport.circuitSafetyScore,
      status: safetyReport.success ? 'SAFE' : 'WARNINGS',
      warnings: safetyReport.warnings.filter((warning) => warning.severity !== 'info'),
    },
  });
}));

router.get('/status/:itemId', asyncHandler(async (req, res) => {
  await connectDatabase();

  const item = await Equipment.findById(req.params.itemId);
  if (!item) {
    return res.status(404).json({ message: 'Item not found.' });
  }

  return res.json({
    itemId: item._id,
    name: item.name,
    currentAvailable: item.currentAvailable,
    totalQuantity: item.totalQuantity,
    percentageAvailable: ((item.currentAvailable / item.totalQuantity) * 100).toFixed(1),
  });
}));

module.exports = router;
