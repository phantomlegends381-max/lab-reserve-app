require('dotenv').config();

const Equipment = require('../models/Equipment');
const hardwareInventorySeed = require('../data/hardwareInventorySeed');
const { connectDatabase } = require('../config/database');

async function seedInventory() {
  await connectDatabase();

  await Equipment.deleteMany({});
  const inserted = await Equipment.insertMany(hardwareInventorySeed, {
    ordered: true,
  });

  console.log(`Seeded ${inserted.length} Lab-Reserve hardware inventory items.`);
}

seedInventory()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Inventory seed failed:', error);
    process.exit(1);
  });
