const hardwareInventorySeed = require('../data/hardwareInventorySeed');

const inventoryByPartNumber = new Map(
  hardwareInventorySeed.map((component) => [component.partNumber, component])
);

const inventoryByName = new Map(
  hardwareInventorySeed.map((component) => [component.name.toLowerCase(), component])
);

const defaultRegulatorLimits = {
  3.3: 250,
  5.0: 450,
};

function normalizeCircuitSchema(payload = {}) {
  if (Array.isArray(payload)) {
    return { components: payload, connections: [] };
  }

  return {
    projectName: payload.projectName || payload.name || 'Untitled circuit',
    components: Array.isArray(payload.components) ? payload.components : [],
    connections: Array.isArray(payload.connections) ? payload.connections : [],
  };
}

function findInventoryComponent(component) {
  if (!component) return null;

  const candidates = [
    component.partNumber,
    component.type,
    component.sku,
    component.name,
  ].filter(Boolean);

  for (const candidate of candidates) {
    const exact = inventoryByPartNumber.get(candidate);
    if (exact) return exact;

    const byName = inventoryByName.get(String(candidate).toLowerCase());
    if (byName) return byName;
  }

  return null;
}

function validateCircuitSchema(rawPayload = {}) {
  const schema = normalizeCircuitSchema(rawPayload);
  const warnings = [];
  const components = schema.components.map((component, index) => {
    const inventoryItem = findInventoryComponent(component);

    if (!inventoryItem) {
      warnings.push(createWarning({
        code: 'UNKNOWN_COMPONENT',
        severity: 'critical',
        componentId: component.id || component.partNumber || component.name || `component-${index + 1}`,
        componentName: component.name || component.partNumber || 'Unknown component',
        message: 'Component is not present in the approved hardware inventory.',
        mitigation: 'Use a known partNumber from the Lab-Reserve inventory seed before approving checkout.',
        penalty: 20,
      }));
    }

    return {
      id: component.id || component.ref || component.partNumber || `component-${index + 1}`,
      quantity: Number(component.quantity || 1),
      suppliedBy: component.suppliedBy,
      powerSource: component.powerSource,
      raw: component,
      inventory: inventoryItem,
    };
  });

  const knownComponents = components.filter((component) => component.inventory);
  const hostControllers = knownComponents.filter(isHostController);
  const levelShifters = knownComponents.filter((component) => component.inventory.specs.isLogicLevelShifter);

  if (schema.components.length === 0) {
    warnings.push(createWarning({
      code: 'EMPTY_BOM',
      severity: 'critical',
      componentId: 'bom',
      componentName: 'Bill of Materials',
      message: 'No components were provided for validation.',
      mitigation: 'Upload a JSON BOM with at least one controller and one attached component.',
      penalty: 35,
    }));
  }

  if (hostControllers.length === 0 && knownComponents.length > 0) {
    warnings.push(createWarning({
      code: 'NO_HOST_CONTROLLER',
      severity: 'warning',
      componentId: 'bom',
      componentName: 'Circuit topology',
      message: 'No microcontroller or single-board-computer host was detected.',
      mitigation: 'Include the board that owns the GPIO pins so voltage domains and regulator limits can be checked.',
      penalty: 10,
    }));
  }

  warnings.push(...checkVoltageDomains(knownComponents, schema.connections, levelShifters));
  warnings.push(...checkCurrentOverdraw(knownComponents, schema.connections, hostControllers));
  warnings.push(...checkExternalPowerRequirements(knownComponents));

  const penalty = warnings.reduce((total, warning) => total + warning.penalty, 0);
  const circuitSafetyScore = Math.max(0, Math.min(100, 100 - penalty));
  const criticalCount = warnings.filter((warning) => warning.severity === 'critical').length;

  return {
    success: criticalCount === 0,
    circuitSafetyScore,
    warnings: warnings.map(({ penalty: _penalty, ...warning }) => warning),
    diagnostics: {
      projectName: schema.projectName,
      componentCount: schema.components.length,
      knownComponentCount: knownComponents.length,
      unknownComponentCount: schema.components.length - knownComponents.length,
      connectionCount: schema.connections.length,
      hostControllers: hostControllers.map(toDiagnosticComponent),
      levelShiftersDetected: levelShifters.map(toDiagnosticComponent),
    },
  };
}

function checkVoltageDomains(components, connections, levelShifters) {
  const warnings = [];
  const connectedPairs = getConnectionPairs(components, connections);

  for (const [source, target, connection] of connectedPairs) {
    if (!source.inventory || !target.inventory) continue;
    if (connection && !connection.inferred && normalizePurpose(connection.purpose) === 'power') continue;

    const sourceLogic = source.inventory.specs.logicLevel;
    const targetLogic = target.inventory.specs.logicLevel;
    const sourceIsHost = isHostController(source);
    const targetIsHost = isHostController(target);

    if (!sourceIsHost && !targetIsHost) continue;
    if (!isUnsafeLogicMismatch(sourceLogic, targetLogic)) continue;
    if (connectionHasLevelShifter(connection, components, levelShifters)) continue;

    const host = sourceIsHost ? source : target;
    const peripheral = sourceIsHost ? target : source;

    warnings.push(createWarning({
      code: 'VOLTAGE_DOMAIN_VIOLATION',
      severity: 'critical',
      componentId: peripheral.id,
      componentName: peripheral.inventory.name,
      relatedComponentId: host.id,
      relatedComponentName: host.inventory.name,
      message: `${host.inventory.name} uses ${host.inventory.specs.logicLevel}V GPIO, but ${peripheral.inventory.name} exposes ${peripheral.inventory.specs.logicLevel}V logic on the connected signal path.`,
      mitigation: 'Insert a bidirectional 3.3V/5V logic-level shifter in the topology or choose a voltage-compatible component.',
      evidence: {
        hostLogicLevel: host.inventory.specs.logicLevel,
        peripheralLogicLevel: peripheral.inventory.specs.logicLevel,
        connection,
      },
      penalty: 30,
    }));
  }

  return warnings;
}

function checkCurrentOverdraw(components, connections, hostControllers) {
  const warnings = [];

  for (const host of hostControllers) {
    const safeLimit = host.inventory.specs.regulatorSafeCurrentMa
      || defaultRegulatorLimits[host.inventory.specs.logicLevel]
      || 250;

    const directLoads = components.filter((component) => {
      if (component.id === host.id || !component.inventory) return false;
      if (component.powerSource === 'external' || component.raw.externalPower === true) return false;
      if (component.suppliedBy === host.id || component.powerSource === host.id) return true;

      return connections.some((connection) => (
        isSameEndpoint(connection.from, host.id)
        && isSameEndpoint(connection.to, component.id)
        && normalizePurpose(connection.purpose) === 'power'
        && connection.via !== 'external'
      ));
    });

    const totalCurrentMa = directLoads.reduce((total, component) => (
      total + (component.inventory.specs.peakCurrentMa * component.quantity)
    ), 0);

    if (totalCurrentMa > safeLimit) {
      warnings.push(createWarning({
        code: 'CURRENT_OVERDRAW_CASCADE',
        severity: 'critical',
        componentId: host.id,
        componentName: host.inventory.name,
        message: `${host.inventory.name} regulator load is estimated at ${totalCurrentMa}mA, above its safe ${safeLimit}mA lab threshold.`,
        mitigation: 'Move servos, motors, relays, heaters, LED strips, and SBC loads to an external PDN with a shared ground.',
        evidence: {
          safeLimitMa: safeLimit,
          estimatedLoadMa: totalCurrentMa,
          directLoads: directLoads.map(toDiagnosticComponent),
        },
        penalty: 35,
      }));
    } else if (directLoads.length > 0 && totalCurrentMa > safeLimit * 0.75) {
      warnings.push(createWarning({
        code: 'REGULATOR_HEADROOM_LOW',
        severity: 'warning',
        componentId: host.id,
        componentName: host.inventory.name,
        message: `${host.inventory.name} regulator load is ${totalCurrentMa}mA, leaving little margin below the ${safeLimit}mA threshold.`,
        mitigation: 'Use an external power rail for non-trivial loads before adding more components.',
        evidence: {
          safeLimitMa: safeLimit,
          estimatedLoadMa: totalCurrentMa,
          directLoads: directLoads.map(toDiagnosticComponent),
        },
        penalty: 12,
      }));
    }
  }

  return warnings;
}

function checkExternalPowerRequirements(components) {
  return components
    .filter((component) => component.inventory.specs.requiresExternalPower)
    .filter((component) => component.powerSource !== 'external' && component.raw.externalPower !== true)
    .map((component) => createWarning({
      code: 'EXTERNAL_POWER_REQUIRED',
      severity: 'critical',
      componentId: component.id,
      componentName: component.inventory.name,
      message: `${component.inventory.name} peaks at ${component.inventory.specs.peakCurrentMa}mA and must not be powered from a controller pin.`,
      mitigation: 'Assign this component to an external supply or PDN in the BOM and connect grounds together.',
      evidence: {
        peakCurrentMa: component.inventory.specs.peakCurrentMa,
        operatingVoltage: component.inventory.specs.operatingVoltage,
      },
      penalty: 18,
    }));
}

function getConnectionPairs(components, connections) {
  if (connections.length === 0) {
    const hosts = components.filter(isHostController);
    const peripherals = components.filter((component) => !isHostController(component));
    return hosts.flatMap((host) => peripherals.map((peripheral) => [host, peripheral, { inferred: true }]));
  }

  return connections
    .map((connection) => {
      const source = components.find((component) => isSameEndpoint(connection.from, component.id));
      const target = components.find((component) => isSameEndpoint(connection.to, component.id));
      return source && target ? [source, target, connection] : null;
    })
    .filter(Boolean);
}

function connectionHasLevelShifter(connection, components, levelShifters) {
  if (levelShifters.length === 0) return false;

  const via = connection && connection.via;
  if (!via) return false;

  if (Array.isArray(via)) {
    return via.some((viaId) => isLevelShifterId(viaId, levelShifters));
  }

  return isLevelShifterId(via, levelShifters);
}

function isLevelShifterId(value, levelShifters) {
  return levelShifters.some((component) => (
    component.id === value
    || component.inventory.partNumber === value
    || component.inventory.name === value
  ));
}

function isUnsafeLogicMismatch(sourceLogic, targetLogic) {
  return Math.abs(Number(sourceLogic) - Number(targetLogic)) >= 1.0;
}

function isHostController(component) {
  return component.inventory
    && ['Microcontrollers', 'Single Board Computers'].includes(component.inventory.category);
}

function isSameEndpoint(endpoint, componentId) {
  if (!endpoint) return false;
  if (typeof endpoint === 'string') return endpoint === componentId;
  return endpoint.componentId === componentId || endpoint.id === componentId;
}

function normalizePurpose(purpose) {
  return String(purpose || '').toLowerCase();
}

function createWarning({ penalty, ...warning }) {
  return {
    severity: warning.severity,
    code: warning.code,
    componentId: warning.componentId,
    componentName: warning.componentName,
    relatedComponentId: warning.relatedComponentId,
    relatedComponentName: warning.relatedComponentName,
    message: warning.message,
    mitigation: warning.mitigation,
    evidence: warning.evidence || {},
    penalty,
  };
}

function toDiagnosticComponent(component) {
  return {
    id: component.id,
    partNumber: component.inventory.partNumber,
    name: component.inventory.name,
    category: component.inventory.category,
    operatingVoltage: component.inventory.specs.operatingVoltage,
    logicLevel: component.inventory.specs.logicLevel,
    peakCurrentMa: component.inventory.specs.peakCurrentMa,
  };
}

module.exports = {
  validateCircuitSchema,
  normalizeCircuitSchema,
  hardwareInventorySeed,
};
