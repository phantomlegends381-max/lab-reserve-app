/**
 * Lab-Reserve Hardware Inventory
 * Realistic STEM prototyping hub inventory with detailed specs
 * Each item includes voltage, pin count, availability, and safety metadata
 */

export const inventory = [
  // ===== MICROCONTROLLERS =====
  {
    id: 'mcu-001',
    name: 'ESP32 DevKit V1',
    category: 'Microcontroller',
    specs: {
      voltage: '3.3V',
      pins: 30,
      processor: 'Dual-core 240MHz',
      features: 'Wi-Fi, Bluetooth, Built-in Antenna',
    },
    totalQuantity: 25,
    currentAvailable: 18,
    imageURL: 'https://via.placeholder.com/320x240?text=ESP32+DevKit+V1',
  },
  {
    id: 'mcu-002',
    name: 'Arduino Uno R3',
    category: 'Microcontroller',
    specs: {
      voltage: '5V',
      pins: 14,
      processor: 'ATmega328P 16MHz',
      features: 'Open-source, USB programming, learner-friendly',
    },
    totalQuantity: 20,
    currentAvailable: 12,
    imageURL: 'https://via.placeholder.com/320x240?text=Arduino+Uno+R3',
  },
  {
    id: 'mcu-003',
    name: 'Raspberry Pi Pico',
    category: 'Microcontroller',
    specs: {
      voltage: '3.3V',
      pins: 26,
      processor: 'Dual-core ARM 133MHz',
      features: 'MicroPython support, ultra-affordable',
    },
    totalQuantity: 15,
    currentAvailable: 8,
    imageURL: 'https://via.placeholder.com/320x240?text=Raspberry+Pi+Pico',
  },

  // ===== SENSORS =====
  {
    id: 'sen-001',
    name: 'HC-SR04 Ultrasonic Distance Sensor',
    category: 'Sensor',
    specs: {
      voltage: '5V',
      range: '2cm - 400cm',
      accuracy: '±3mm',
      protocol: 'Digital (pulse width)',
    },
    totalQuantity: 30,
    currentAvailable: 28,
    imageURL: 'https://via.placeholder.com/320x240?text=HC-SR04',
  },
  {
    id: 'sen-002',
    name: 'DHT11 Temperature/Humidity Sensor',
    category: 'Sensor',
    specs: {
      voltage: '3.3V - 5V',
      tempRange: '0°C - 50°C',
      humidityRange: '20% - 90%',
      protocol: 'Digital (1-wire)',
    },
    totalQuantity: 22,
    currentAvailable: 16,
    imageURL: 'https://via.placeholder.com/320x240?text=DHT11',
  },
  {
    id: 'sen-003',
    name: 'MPU6050 Gyroscope/Accelerometer',
    category: 'Sensor',
    specs: {
      voltage: '3.3V',
      axes: '6-axis (3 gyro + 3 accel)',
      protocol: 'I2C',
      features: 'Motion detection, temperature sensor',
    },
    totalQuantity: 18,
    currentAvailable: 14,
    imageURL: 'https://via.placeholder.com/320x240?text=MPU6050',
  },
  {
    id: 'sen-004',
    name: 'BMP280 Barometric Pressure Sensor',
    category: 'Sensor',
    specs: {
      voltage: '3.3V',
      protocol: 'I2C / SPI',
      range: '300hPa - 1100hPa (altitude: -500m to +9000m)',
      features: 'Temperature compensated',
    },
    totalQuantity: 12,
    currentAvailable: 10,
    imageURL: 'https://via.placeholder.com/320x240?text=BMP280',
  },

  // ===== PROTOTYPING & PASSIVE COMPONENTS =====
  {
    id: 'proto-001',
    name: 'Breadboard (400-point, Solderless)',
    category: 'Prototyping',
    specs: {
      voltage: 'Passive',
      points: 400,
      features: 'Reusable, color-coded, spring-loaded connections',
      material: 'ABS plastic',
    },
    totalQuantity: 50,
    currentAvailable: 42,
    imageURL: 'https://via.placeholder.com/320x240?text=Breadboard+400pt',
  },
  {
    id: 'proto-002',
    name: 'Jumper Wire Pack (65-piece, Mixed)',
    category: 'Prototyping',
    specs: {
      voltage: 'Passive',
      gauges: '24 AWG (0.205mm)',
      colors: 'Red, Black, Blue, Green, Yellow',
      features: 'Pre-cut and stripped, color-coded',
    },
    totalQuantity: 40,
    currentAvailable: 38,
    imageURL: 'https://via.placeholder.com/320x240?text=Jumper+Wires',
  },
  {
    id: 'proto-003',
    name: 'SG90 5V Servo Motor',
    category: 'Prototyping',
    specs: {
      voltage: '5V',
      torque: '1.2 kg/cm',
      speed: '0.1s/60°',
      control: 'PWM (50Hz)',
    },
    totalQuantity: 16,
    currentAvailable: 11,
    imageURL: 'https://via.placeholder.com/320x240?text=SG90+Servo',
  },
  {
    id: 'proto-004',
    name: 'Resistor Assortment (500-piece, 10Ω-1MΩ)',
    category: 'Prototyping',
    specs: {
      voltage: 'Passive (1/4W)',
      tolerance: '±5%',
      range: '10Ω to 1MΩ',
      features: 'Color-coded bands',
    },
    totalQuantity: 20,
    currentAvailable: 19,
    imageURL: 'https://via.placeholder.com/320x240?text=Resistor+Pack',
  },
  {
    id: 'proto-005',
    name: 'LED Assortment (100-piece, 5mm RGB & Basic)',
    category: 'Prototyping',
    specs: {
      voltage: '2V - 5V',
      colors: 'Red, Green, Blue, RGB, White',
      features: 'Common anode/cathode variants',
      current: '20mA typical',
    },
    totalQuantity: 15,
    currentAvailable: 13,
    imageURL: 'https://via.placeholder.com/320x240?text=LED+Pack',
  },
  {
    id: 'proto-006',
    name: 'Capacitor Assortment (200-piece, 1nF-1000µF)',
    category: 'Prototyping',
    specs: {
      voltage: 'Passive (up to 50V)',
      types: 'Ceramic, Electrolytic',
      tolerance: '±10%',
      features: 'Common values for prototyping',
    },
    totalQuantity: 10,
    currentAvailable: 9,
    imageURL: 'https://via.placeholder.com/320x240?text=Capacitor+Pack',
  },

  // ===== POWER & CONNECTIVITY =====
  {
    id: 'pwr-001',
    name: 'USB-C Programmable Power Supply (3A, 0-30V)',
    category: 'Power',
    specs: {
      voltage: '0V - 30V adjustable',
      current: '3A max',
      protection: 'Overvoltage, overcurrent, overtemp',
      features: 'Lab-grade, digital display',
    },
    totalQuantity: 5,
    currentAvailable: 4,
    imageURL: 'https://via.placeholder.com/320x240?text=Power+Supply',
  },
  {
    id: 'conn-001',
    name: 'USB Type-C Cable (1m, 3.1A rated)',
    category: 'Connectivity',
    specs: {
      voltage: 'Up to 20V (USB PD)',
      current: '3.1A',
      length: '1 meter',
      features: 'Gold-plated, braided',
    },
    totalQuantity: 25,
    currentAvailable: 22,
    imageURL: 'https://via.placeholder.com/320x240?text=USB+Type-C',
  },
  {
    id: 'conn-002',
    name: 'FTDI Serial USB Adapter (5V)',
    category: 'Connectivity',
    specs: {
      voltage: '5V',
      protocol: 'UART (RS232 emulation)',
      baud: 'Up to 3Mbps',
      features: 'For legacy serial debugging',
    },
    totalQuantity: 8,
    currentAvailable: 6,
    imageURL: 'https://via.placeholder.com/320x240?text=FTDI+Adapter',
  },
];

export default inventory;
