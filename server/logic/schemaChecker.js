// Basic logic checker for circuit compatibility in the Lab-Reserve hardware inventory.

const partSpecs = {
  'ESP32-DEVKITC': { voltage: 3.3, name: 'ESP32 DevKitC', type: 'microcontroller' },
  'ARDUINO-UNO': { voltage: 5, name: 'Arduino Uno', type: 'microcontroller' },
  '5V-TEMP': { voltage: 5, name: '5V Temperature Sensor', type: 'sensor' },
  '3V-ACCEL': { voltage: 3.3, name: '3.3V Accelerometer', type: 'sensor' },
};

/**
 * verifyCircuit checks a set of selected components for basic compatibility issues.
 * @param {Array<{ partNumber: string, role: string }>} components
 * @returns {Object} result with success flag and errors array
 */
function verifyCircuit(components) {
  const errors = [];

  if (!Array.isArray(components) || components.length === 0) {
    return {
      success: false,
      errors: ['No components were selected.'],
    };
  }

  const selectedParts = components.map((item) => partSpecs[item.partNumber]);
  const mcu = components.find((item) => {
    const spec = partSpecs[item.partNumber];
    return spec && spec.type === 'microcontroller';
  });

  if (!mcu) {
    errors.push('Please select at least one microcontroller (Arduino or ESP32).');
  }

  if (mcu) {
    const mcuSpec = partSpecs[mcu.partNumber];
    components.forEach((item) => {
      const spec = partSpecs[item.partNumber];
      if (!spec) {
        errors.push(`Unknown component: ${item.partNumber}`);
        return;
      }

      if (spec.type === 'sensor' && spec.voltage !== mcuSpec.voltage) {
        errors.push(
          `Voltage mismatch: ${spec.name} (${spec.voltage}V) is not compatible with ${mcuSpec.name} (${mcuSpec.voltage}V).`
        );
      }
    });
  }

  // Example of a simple safety rule: avoid selecting two identical serial-numbered items as one checkout.
  const serials = components
    .filter((item) => item.serialNumber)
    .map((item) => item.serialNumber);

  const duplicateSerial = serials.find((serial, index) => serials.indexOf(serial) !== index);
  if (duplicateSerial) {
    errors.push(`Duplicate serial number detected: ${duplicateSerial}. Each device must be checked out separately.`);
  }

  return {
    success: errors.length === 0,
    errors,
  };
}

module.exports = {
  verifyCircuit,
};
