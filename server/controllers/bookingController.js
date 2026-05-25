const Equipment = require('../models/Equipment');
const { connectDatabase } = require('../config/database');

async function bookEquipment(req, res) {
  await connectDatabase();

  const { equipmentId, checkedOutBy } = req.body;

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
  item.checkedOutBy = checkedOutBy || item.checkedOutBy;
  item.checkedOutAt = new Date();
  await item.save();

  return res.status(200).json({
    message: 'Equipment booked successfully.',
    equipment: item,
  });
}

module.exports = {
  bookEquipment,
};
