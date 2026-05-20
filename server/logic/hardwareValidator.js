/**
 * HARDWARE SAFETY VALIDATION ENGINE
 * 
 * Comprehensive circuit schema analysis that checks for critical electrical safety issues:
 * 1. Voltage domain mismatches (3.3V ↔ 5V incompatibilities)
 * 2. Current overdraw risks (high-current devices on weak power sources)
 * 3. Component configuration errors (invalid/unknown components)
 * 
 * Returns structured safety report with score (0-100) and detailed warnings.
 * 
 * SAFETY STANDARDS:
 * - All voltage levels must be compatible (within ±0.5V tolerance for logic)
 * - High-current devices (>500mA) require isolated power supplies
 * - All components must exist in active hardware database
 * - Logic-level converters required for voltage domain transitions
 */

/**
 * HARDWARE COMPONENT DATABASE
 * Defines all supported components with electrical specifications
 * 
 * Schema:
 * - id: Unique component identifier
 * - name: Display name
 * - category: Component type (MCU, Sensor, Actuator, Power, Converter, Passive)
 * - voltage: Operating voltage (string like "3.3V" or "5V" or "3.3V-5V")
 * - maxCurrent: Maximum current draw in mA
 * - powerPin: Where power is sourced (MCU_PIN, EXTERNAL_SUPPLY, USB)
 * - traits: Special features (LOGIC_LEVEL_CONVERTER, HIGH_CURRENT, VOLTAGE_TOLERANT)
 */
const HARDWARE_DATABASE = {
  // ===== MICROCONTROLLERS =====
  'esp32': {
    name: 'ESP32-WROOM-32U',
    category: 'MCU',
    voltage: '3.3V',
    maxCurrent: 80,
    powerPin: 'EXTERNAL_SUPPLY',
    traits: ['WIFI', 'BLUETOOTH', 'GPIO_TOLERANT']
  },
  'arduino-uno': {
    name: 'Arduino Uno R3',
    category: 'MCU',
    voltage: '5V',
    maxCurrent: 200,
    powerPin: 'USB',
    traits: ['BEGINNER_FRIENDLY']
  },
  'arduino-mega': {
    name: 'Arduino Mega 2560',
    category: 'MCU',
    voltage: '5V',
    maxCurrent: 200,
    powerPin: 'USB',
    traits: ['HIGH_PIN_COUNT']
  },
  'rpi-pico': {
    name: 'Raspberry Pi Pico',
    category: 'MCU',
    voltage: '3.3V',
    maxCurrent: 100,
    powerPin: 'USB',
    traits: ['MICROPYTHON', 'GPIO_TOLERANT']
  },
  'esp32-cam': {
    name: 'ESP32-CAM',
    category: 'MCU',
    voltage: '3.3V',
    maxCurrent: 150,
    powerPin: 'EXTERNAL_SUPPLY',
    traits: ['CAMERA', 'WIFI']
  },

  // ===== SENSORS =====
  'hc-sr04': {
    name: 'HC-SR04 Ultrasonic Sensor',
    category: 'Sensor',
    voltage: '5V',
    maxCurrent: 15,
    powerPin: 'MCU_PIN',
    traits: ['STRICTLY_5V']
  },
  'dht11': {
    name: 'DHT11 Temperature/Humidity',
    category: 'Sensor',
    voltage: '3.3V-5V',
    maxCurrent: 5,
    powerPin: 'MCU_PIN',
    traits: ['VOLTAGE_TOLERANT']
  },
  'mpu6050': {
    name: 'MPU-6050 Gyroscope/Accelerometer',
    category: 'Sensor',
    voltage: '3.3V',
    maxCurrent: 4,
    powerPin: 'MCU_PIN',
    traits: ['I2C', 'STRICT_3V3']
  },
  'bme280': {
    name: 'BME280 Environmental Sensor',
    category: 'Sensor',
    voltage: '3.3V',
    maxCurrent: 4,
    powerPin: 'MCU_PIN',
    traits: ['I2C_SPI', 'STRICT_3V3']
  },
  'vl53l0x': {
    name: 'VL53L0X Time-of-Flight Sensor',
    category: 'Sensor',
    voltage: '3.3V',
    maxCurrent: 5,
    powerPin: 'MCU_PIN',
    traits: ['I2C', 'STRICT_3V3']
  },

  // ===== ACTUATORS =====
  'sg90': {
    name: 'SG90 Micro Servo',
    category: 'Actuator',
    voltage: '5V',
    maxCurrent: 500,
    powerPin: 'EXTERNAL_SUPPLY',
    traits: ['HIGH_CURRENT', 'MUST_EXTERNAL_POWER']
  },
  'mg996r': {
    name: 'MG996R Metal Gear Servo',
    category: 'Actuator',
    voltage: '6V',
    maxCurrent: 900,
    powerPin: 'EXTERNAL_SUPPLY',
    traits: ['HIGH_CURRENT', 'MUST_EXTERNAL_POWER']
  },
  'dc-motor': {
    name: 'DC Motor with Gearbox',
    category: 'Actuator',
    voltage: '3V-6V',
    maxCurrent: 600,
    powerPin: 'EXTERNAL_SUPPLY',
    traits: ['HIGH_CURRENT', 'MUST_EXTERNAL_POWER']
  },

  // ===== LOGIC LEVEL CONVERTERS =====
  'level-converter-5v-3v': {
    name: 'Bidirectional Logic Level Converter (5V ↔ 3.3V)',
    category: 'Converter',
    voltage: '3.3V-5V',
    maxCurrent: 50,
    powerPin: 'MCU_PIN',
    traits: ['LOGIC_LEVEL_CONVERTER', 'VOLTAGE_BRIDGE']
  },
  'fet-level-shifter': {
    name: 'FET-Based Level Shifter',
    category: 'Converter',
    voltage: '3.3V-5V',
    maxCurrent: 100,
    powerPin: 'MCU_PIN',
    traits: ['LOGIC_LEVEL_CONVERTER', 'HIGH_SPEED']
  },

  // ===== POWER SUPPLIES =====
  'usb-power-supply': {
    name: 'USB-C Programmable Power Supply',
    category: 'Power',
    voltage: '5V-30V',
    maxCurrent: 3000,
    powerPin: 'EXTERNAL',
    traits: ['EXTERNAL_POWER', 'ADJUSTABLE']
  },
  '5v-regulator': {
    name: '5V Voltage Regulator',
    category: 'Power',
    voltage: '5V',
    maxCurrent: 1000,
    powerPin: 'EXTERNAL',
    traits: ['EXTERNAL_POWER']
  },

  // ===== PASSIVE COMPONENTS =====
  'breadboard': {
    name: 'Breadboard 830-point',
    category: 'Passive',
    voltage: 'N/A',
    maxCurrent: 0,
    powerPin: 'N/A',
    traits: ['MECHANICAL']
  },
  'jumper-wires': {
    name: 'Jumper Wires',
    category: 'Passive',
    voltage: 'N/A',
    maxCurrent: 0,
    powerPin: 'N/A',
    traits: ['MECHANICAL']
  },
  'resistor': {
    name: 'Resistor',
    category: 'Passive',
    voltage: 'N/A',
    maxCurrent: 0,
    powerPin: 'N/A',
    traits: ['MECHANICAL']
  }
};

/**
 * VOLTAGE COMPATIBILITY RULES
 * Defines which voltage levels can safely work together
 * Used for intelligent checking of voltage domain mismatches
 */
const VOLTAGE_RULES = {
  '3.3V': {
    compatible: ['3.3V', '3.3V-5V'],
    incompatible: ['5V', '6V'],
    needsConverter: true
  },
  '5V': {
    compatible: ['5V', '3.3V-5V'],
    incompatible: ['3.3V', '6V'],
    needsConverter: true
  },
  '6V': {
    compatible: ['6V', '3.3V-5V'],
    incompatible: ['3.3V', '5V'],
    needsConverter: true
  },
  '3.3V-5V': {
    compatible: ['3.3V', '5V', '3.3V-5V', '6V'],
    incompatible: [],
    needsConverter: false
  }
};

/**
 * validateCircuitSchema
 * Main validation function that analyzes circuit structure for safety issues
 * 
 * @param {Array} components - List of component objects from circuit file
 * @param {Array} connections - List of connection rules (optional)
 * @returns {Object} Safety report with score and warnings
 */
function validateCircuitSchema(components = [], connections = []) {
  // Initialize safety report
  const report = {
    success: true,
    safetyScore: 100,
    warnings: [],
    violations: {
      critical: [],
      warning: [],
      info: []
    },
    componentAnalysis: {
      total: components.length,
      validated: 0,
      invalid: 0
    }
  };

  if (!components || components.length === 0) {
    report.violations.info.push('No components provided for validation');
    return report;
  }

  // ===== STEP 1: VALIDATE EACH COMPONENT =====
  const validatedComponents = [];
  const componentMap = new Map();

  for (const component of components) {
    const componentId = component.id || component.name;
    
    // Check if component exists in database
    if (!HARDWARE_DATABASE[component.type]) {
      report.violations.critical.push(
        `Unknown component: "${component.name}" (type: ${component.type}). Not in active hardware database.`
      );
      report.componentAnalysis.invalid++;
      continue;
    }

    const dbComponent = HARDWARE_DATABASE[component.type];
    validatedComponents.push({
      ...component,
      spec: dbComponent
    });
    componentMap.set(componentId, dbComponent);
    report.componentAnalysis.validated++;
  }

  // ===== STEP 2: VOLTAGE DOMAIN MISMATCH DETECTION =====
  // Find all microcontrollers in the circuit
  const microcontrollers = validatedComponents.filter(c => c.spec.category === 'MCU');
  const sensors = validatedComponents.filter(c => c.spec.category === 'Sensor');
  const actuators = validatedComponents.filter(c => c.spec.category === 'Actuator');
  const converters = validatedComponents.filter(c => c.spec.category === 'Converter');
  
  if (microcontrollers.length > 0) {
    for (const mcu of microcontrollers) {
      const mcuVoltage = mcu.spec.voltage;

      // Check sensors connected to this MCU
      for (const sensor of sensors) {
        const sensorVoltage = sensor.spec.voltage;
        
        // Check if voltages are incompatible
        if (!isVoltageCompatible(mcuVoltage, sensorVoltage)) {
          const hasConverter = converters.length > 0;
          
          if (!hasConverter) {
            report.violations.critical.push(
              `VOLTAGE MISMATCH: ${mcu.name} (${mcuVoltage}) connected directly to ${sensor.name} (${sensorVoltage}) without a logic-level converter. This will damage the ${mcuVoltage} device. Solution: Add a bidirectional logic-level converter between the two voltage domains.`
            );
            report.safetyScore -= 25;
            report.success = false;
          } else {
            report.violations.warning.push(
              `Voltage domain mismatch detected: ${mcu.name} (${mcuVoltage}) to ${sensor.name} (${sensorVoltage}). Logic-level converter is present in inventory but may not be properly connected in the circuit.`
            );
            report.safetyScore -= 10;
          }
        }
      }

      // Check actuators connected to this MCU
      for (const actuator of actuators) {
        const actuatorVoltage = actuator.spec.voltage;
        
        // Voltage incompatibility check
        if (!isVoltageCompatible(mcuVoltage, actuatorVoltage)) {
          const hasConverter = converters.length > 0;
          
          if (!hasConverter) {
            report.violations.critical.push(
              `VOLTAGE MISMATCH: ${mcu.name} (${mcuVoltage}) cannot drive ${actuator.name} (${actuatorVoltage}) directly. Solution: Add a logic-level converter for signal lines, and use an external power supply for the actuator.`
            );
            report.safetyScore -= 25;
            report.success = false;
          }
        }
      }
    }
  }

  // ===== STEP 3: CURRENT OVERDRAW RISK DETECTION =====
  // Check if high-current devices are on MCU pins (dangerous!)
  for (const component of validatedComponents) {
    const spec = component.spec;
    
    // High-current components should NEVER draw from MCU pins
    if (spec.traits && spec.traits.includes('HIGH_CURRENT')) {
      if (spec.powerPin === 'MCU_PIN') {
        report.violations.critical.push(
          `CURRENT OVERDRAW RISK: ${component.name} draws ${spec.maxCurrent}mA and must NOT be powered from MCU pins. The MCU regulator can only supply ~100mA safely. SOLUTION: Connect ${component.name} to an isolated external power supply (USB adapter, battery pack, etc.).`
        );
        report.safetyScore -= 30;
        report.success = false;
      }
    }

    // Check if device can handle the voltage
    if (spec.traits && spec.traits.includes('MUST_EXTERNAL_POWER')) {
      const hasPowerSupply = validatedComponents.some(c => 
        c.spec.category === 'Power' && c.spec.powerPin === 'EXTERNAL'
      );
      
      if (!hasPowerSupply) {
        report.violations.critical.push(
          `POWER SUPPLY MISSING: ${component.name} requires an isolated external power supply (${spec.voltage}, ${spec.maxCurrent}mA). No external power supply found in circuit design.`
        );
        report.safetyScore -= 20;
        report.success = false;
      }
    }
  }

  // ===== STEP 4: COMPONENT CONFIGURATION VALIDATION =====
  for (const component of validatedComponents) {
    const spec = component.spec;
    
    // Strict 3.3V components check
    if (spec.traits && spec.traits.includes('STRICT_3V3')) {
      if (component.suppliedVoltage && component.suppliedVoltage !== '3.3V') {
        report.violations.critical.push(
          `VOLTAGE CONFIGURATION ERROR: ${component.name} requires exactly 3.3V but is receiving ${component.suppliedVoltage}. This will permanently damage the component.`
        );
        report.safetyScore -= 25;
        report.success = false;
      }
    }

    // Strictly 5V components check
    if (spec.traits && spec.traits.includes('STRICTLY_5V')) {
      if (component.suppliedVoltage && component.suppliedVoltage !== '5V') {
        report.violations.critical.push(
          `VOLTAGE CONFIGURATION ERROR: ${component.name} requires exactly 5V but is receiving ${component.suppliedVoltage}.`
        );
        report.safetyScore -= 25;
        report.success = false;
      }
    }
  }

  // ===== BUILD WARNING MESSAGES =====
  report.warnings = [
    ...report.violations.critical.map(msg => ({ severity: 'CRITICAL', message: msg })),
    ...report.violations.warning.map(msg => ({ severity: 'WARNING', message: msg })),
    ...report.violations.info.map(msg => ({ severity: 'INFO', message: msg }))
  ];

  // Clamp safety score to 0-100 range
  report.safetyScore = Math.max(0, Math.min(100, report.safetyScore));

  return report;
}

/**
 * isVoltageCompatible
 * Checks if two voltage levels can safely work together
 * 
 * @param {string} voltage1 - First voltage level (e.g., "3.3V")
 * @param {string} voltage2 - Second voltage level (e.g., "5V")
 * @returns {boolean} True if compatible, false if would cause damage
 */
function isVoltageCompatible(voltage1, voltage2) {
  // Exact match is always compatible
  if (voltage1 === voltage2) return true;

  // Check if either is a tolerance range
  const rules1 = VOLTAGE_RULES[voltage1];
  const rules2 = VOLTAGE_RULES[voltage2];

  if (rules1 && rules1.compatible.includes(voltage2)) return true;
  if (rules2 && rules2.compatible.includes(voltage1)) return true;

  return false;
}

/**
 * parseCircuitFile
 * Converts various circuit file formats into standard component format
 * 
 * Supports:
 * - BOM JSON: { components: [{id, name, type, quantity}] }
 * - CSV/TSV: Parsed into components array
 * - Fritzing: XML with component references
 * 
 * @param {string} fileContent - Raw file content
 * @param {string} fileType - File format (json, csv, fritzing, text)
 * @returns {Array} Normalized component array
 */
function parseCircuitFile(fileContent, fileType = 'json') {
  try {
    if (fileType === 'json') {
      const data = JSON.parse(fileContent);
      return data.components || data || [];
    }

    if (fileType === 'csv' || fileType === 'tsv') {
      const delimiter = fileType === 'csv' ? ',' : '\t';
      const lines = fileContent.split('\n');
      const headers = lines[0].split(delimiter);
      
      return lines.slice(1)
        .filter(line => line.trim())
        .map(line => {
          const values = line.split(delimiter);
          return {
            id: values[headers.indexOf('id')] || values[0],
            name: values[headers.indexOf('name')] || values[1],
            type: values[headers.indexOf('type')] || values[2],
            quantity: parseInt(values[headers.indexOf('quantity')] || 1)
          };
        });
    }

    if (fileType === 'fritzing' || fileType === 'xml') {
      // Simple XML/Fritzing parser
      const componentRegex = /<component[^>]*id="([^"]*)"[^>]*>.*?<title>([^<]*)<\/title>/gs;
      const components = [];
      let match;

      while ((match = componentRegex.exec(fileContent)) !== null) {
        components.push({
          id: match[1],
          name: match[2],
          type: match[2].toLowerCase()
        });
      }

      return components;
    }

    // Fallback: treat as newline-separated component list
    return fileContent
      .split('\n')
      .filter(line => line.trim())
      .map(line => ({
        name: line.trim(),
        type: line.trim().toLowerCase()
      }));
  } catch (error) {
    console.error('Error parsing circuit file:', error);
    return [];
  }
}

// ===== EXPORTS =====
module.exports = {
  validateCircuitSchema,
  parseCircuitFile,
  HARDWARE_DATABASE,
  VOLTAGE_RULES,
  isVoltageCompatible
};
