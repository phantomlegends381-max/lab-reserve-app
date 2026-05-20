/**
 * VERIFY SCHEMA API ROUTE
 * 
 * POST /api/verify-schema
 * 
 * Accepts circuit schema files (BOM JSON, Fritzing, CSV) and runs comprehensive
 * hardware safety validation. Returns a detailed safety report with violations
 * and a safety score (0-100).
 * 
 * SUPPORTED FILE FORMATS:
 * - BOM JSON: Standard format with components array
 * - Fritzing XML: Circuit design export from Fritzing
 * - CSV/TSV: Component list (id, name, type, voltage)
 * - Plain Text: Newline-separated component names
 * 
 * RESPONSE FORMAT:
 * {
 *   success: boolean,
 *   safetyScore: number (0-100),
 *   warnings: [
 *     { severity: 'CRITICAL'|'WARNING'|'INFO', message: string }
 *   ],
 *   componentAnalysis: {
 *     total: number,
 *     validated: number,
 *     invalid: number
 *   }
 * }
 * 
 * SAFETY RULES ENFORCED:
 * 1. No 3.3V ↔ 5V mismatches without logic-level converters
 * 2. No high-current devices (>500mA) on MCU pins
 * 3. All components must exist in hardware database
 * 4. Strict voltage ratings must be honored
 */

const express = require('express');
const { validateCircuitSchema, parseCircuitFile } = require('../logic/hardwareValidator');

const router = express.Router();

/**
 * POST /api/verify-schema
 * 
 * Request body:
 * {
 *   components: Array,        // (Required) Component list
 *   fileContent: string,      // (Optional) Raw file data for parsing
 *   fileType: string,         // (Optional) File format: 'json', 'csv', 'fritzing', 'text'
 *   connections: Array        // (Optional) Connection rules for advanced checking
 * }
 */
router.post('/verify-schema', async (req, res) => {
  try {
    // ===== INPUT VALIDATION =====
    const { components, fileContent, fileType = 'json', connections = [] } = req.body;

    // If file content provided, parse it
    let parsedComponents = components || [];
    if (fileContent) {
      parsedComponents = parseCircuitFile(fileContent, fileType);
    }

    if (!parsedComponents || parsedComponents.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No components provided. Please submit a valid circuit schema file or component list.',
        safetyScore: 0,
        warnings: []
      });
    }

    // ===== RUN VALIDATION ENGINE =====
    const report = validateCircuitSchema(parsedComponents, connections);

    // ===== STRUCTURED RESPONSE =====
    // Critical violations make the entire circuit unsafe
    if (report.violations.critical.length > 0) {
      report.success = false;
    }

    return res.status(report.success ? 200 : 400).json({
      success: report.success,
      safetyScore: report.safetyScore,
      warnings: report.warnings,
      summary: {
        total: report.componentAnalysis.total,
        validated: report.componentAnalysis.validated,
        invalid: report.componentAnalysis.invalid,
        criticalIssues: report.violations.critical.length,
        warnings: report.violations.warning.length,
        infoMessages: report.violations.info.length
      },
      recommendations: generateRecommendations(report)
    });

  } catch (error) {
    console.error('Schema validation error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error during schema validation',
      details: error.message
    });
  }
});

/**
 * GET /api/verify-schema/example
 * Returns example BOM JSON format for documentation
 */
router.get('/verify-schema/example', (req, res) => {
  const exampleBOM = {
    projectName: 'Smart Temperature Monitor',
    components: [
      {
        id: 'mcu-1',
        name: 'ESP32-WROOM-32U',
        type: 'esp32',
        quantity: 1,
        suppliedVoltage: '3.3V'
      },
      {
        id: 'sensor-1',
        name: 'DHT11 Temperature Sensor',
        type: 'dht11',
        quantity: 1,
        suppliedVoltage: '5V'
      },
      {
        id: 'sensor-2',
        name: 'MPU-6050 Gyroscope',
        type: 'mpu6050',
        quantity: 1,
        suppliedVoltage: '3.3V'
      },
      {
        id: 'converter-1',
        name: 'Logic Level Converter',
        type: 'level-converter-5v-3v',
        quantity: 1
      }
    ]
  };

  res.json({
    format: 'BOM (Bill of Materials) JSON',
    description: 'Standard component list for hardware validation',
    example: exampleBOM,
    supportedFileTypes: ['json', 'csv', 'fritzing', 'text'],
    fieldDefinitions: {
      id: 'Unique component identifier (optional)',
      name: 'Component display name',
      type: 'Component type from hardware database',
      quantity: 'Quantity of this component (default: 1)',
      suppliedVoltage: 'Voltage supplied to this component (optional)'
    }
  });
});

/**
 * generateRecommendations
 * Creates actionable recommendations based on validation results
 * 
 * @param {Object} report - Validation report
 * @returns {Array} List of recommendation strings
 */
function generateRecommendations(report) {
  const recommendations = [];

  // Safety score based recommendations
  if (report.safetyScore <= 30) {
    recommendations.push(
      'DANGER: This circuit design has critical safety issues. DO NOT BUILD. Review all critical violations above.'
    );
  } else if (report.safetyScore <= 60) {
    recommendations.push(
      'WARNING: This circuit has significant issues that should be addressed before building.'
    );
  } else if (report.safetyScore <= 80) {
    recommendations.push(
      'CAUTION: This circuit has minor issues. Review warnings and consider improvements.'
    );
  } else if (report.safetyScore < 100) {
    recommendations.push(
      'Good: This circuit design is mostly safe. Minor improvements recommended.'
    );
  } else {
    recommendations.push(
      'Excellent: This circuit design follows all safety best practices!'
    );
  }

  // Specific recommendations
  if (report.violations.critical.some(v => v.includes('VOLTAGE MISMATCH'))) {
    recommendations.push(
      '→ Add bidirectional logic-level converters between different voltage domains'
    );
  }

  if (report.violations.critical.some(v => v.includes('CURRENT OVERDRAW'))) {
    recommendations.push(
      '→ Use external power supplies for high-current components (servos, motors, relays)'
    );
  }

  if (report.componentAnalysis.invalid > 0) {
    recommendations.push(
      '→ Verify all component types against the supported hardware database'
    );
  }

  if (report.violations.warning.length > 0) {
    recommendations.push(
      '→ Double-check component connections and voltage levels match specifications'
    );
  }

  return recommendations;
}

module.exports = router;
