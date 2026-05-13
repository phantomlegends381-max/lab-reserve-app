const express = require('express');
const router = express.Router();
const Equipment = require('../models/Equipment');

router.post('/book', async (req, res) => {
  try {
    const { equipmentId } = req.body;

    if (!equipmentId) {
      return res.status(400).json({ message: 'Equipment ID is required.' });
    }

    const item = await Equipment.findById(equipmentId);
    if (!item) {
      return res.status(404).json({ message: 'Equipment not found.' });
    }

    if (!item.status) {
      return res.status(409).json({ message: 'This equipment is already in use.' });
    }

    item.status = false;
    await item.save();

    return res.status(200).json({ message: 'Equipment booked successfully.', equipment: item });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({ message: 'Server error while booking equipment.' });
  }
});

module.exports = router;
