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
    enum: [
      'Microcontrollers',
      'Single Board Computers',
      'Sensors',
      'Actuators',
      'Power Management',
      'Discrete Semis',
    ],
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
    manufacturer: { type: String, trim: true },
    description: { type: String, trim: true },
    operatingVoltage: { type: Number, required: true },
    logicLevel: { type: Number, required: true },
    peakCurrentMa: { type: Number, required: true },
    pinLayout: { type: String, trim: true },
    regulatorSafeCurrentMa: { type: Number },
    traits: [{ type: String, trim: true }],
    requiresExternalPower: { type: Boolean, default: false },
    isLogicLevelShifter: { type: Boolean, default: false },
  },
  quantity: {
    type: Number,
    default: 1,
  },
  totalQuantity: {
    type: Number,
    default: 1,
  },
  currentAvailable: {
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
  logistics: {
    mockAsin: { type: String, trim: true },
    distributorSku: { type: String, trim: true },
    awsOpenDataSupplyChainRef: { type: String, trim: true },
    leadTimeDays: { type: Number, default: 7 },
    region: { type: String, default: 'us-west-2', trim: true },
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Equipment', equipmentSchema);
