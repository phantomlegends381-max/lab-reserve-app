const mongoose = require('mongoose');

const equipmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    trim: true,
  },
  status: {
    type: Boolean,
    default: true, // true = Available, false = In Use
  },
  partNumber: {
    type: String,
    trim: true,
  },
  specs: {
    type: String,
    trim: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  serialNumber: {
    type: String,
    trim: true,
    unique: true,
    sparse: true,
  },
  checkedOutBy: {
    type: String,
    trim: true,
  },
  checkedOutAt: {
    type: Date,
  },
  imageURL: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Equipment', equipmentSchema);
