const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.post('/', async (req, res) => {
  try {
    const { serialNumber, userId } = req.body;

    if (!serialNumber || !userId) {
      return res.status(400).json({ message: 'serialNumber and userId are required.' });
    }

    const item = await Equipment.findOne({ serialNumber });
    if (!item) {
      return res.status(404).json({ message: 'Hardware item not found.' });
    }

    if (!item.status) {
      return res.status(409).json({ message: 'This device is already checked out.' });
    }

    item.status = false;
    item.checkedOutBy = userId;
    item.checkedOutAt = new Date();
    await item.save();

    res.status(200).json({ message: 'Device checked out successfully.', item });
  } catch (error) {
    console.error('Checkout error:', error);
    res.status(500).json({ message: 'Server error during checkout.' });
  }
});

module.exports = router;
