export interface SeedCategory {
  _id: string;
  name: string;
  slug: string;
  createdAt: Date;
}

export interface SeedProject {
  _id: string;
  title: string;
  slug: string;
  category: string; // category id or object
  thumbnailImage: string;
  detailImages: string[];
  shortDescription: string;
  fullDescription: string;
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    image?: string;
  }[];
  components: {
    name: string;
    quantity: string;
    link?: string;
  }[];
  sourceCode: {
    filename: string;
    language: string;
    code: string;
  }[];
  youtubeLink?: string;
  instagramLink?: string;
  likeCount: number;
  likedBy: string[];
  viewCount: number;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export const initialCategories: SeedCategory[] = [
  { _id: 'cat-robotics', name: 'Robotics', slug: 'robotics', createdAt: new Date() },
  { _id: 'cat-iot', name: 'IoT & Smart Home', slug: 'iot', createdAt: new Date() },
  { _id: 'cat-electronics', name: 'Electronics & PCB', slug: 'electronics', createdAt: new Date() },
  { _id: 'cat-embedded', name: 'Embedded Systems', slug: 'embedded', createdAt: new Date() },
];

export const initialProjects: SeedProject[] = [
  {
    _id: 'proj-esp32-rover',
    title: 'Autonomous Rover with LiDAR SLAM & ROS2 Navigation',
    slug: 'esp32-autonomous-rover-lidar-slam',
    category: 'cat-robotics',
    thumbnailImage: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    ],
    shortDescription: 'Differential drive exploration robot utilizing 360° RPLiDAR scanner, dual-core ESP32, and ROS2 cartographer for sub-centimeter indoor SLAM navigation.',
    fullDescription: `In this project tutorial, we build an autonomous navigation robot from scratch. Rather than relying on simple ultrasonic obstacle avoidance, we integrate an RPLiDAR A1 360-degree laser range scanner with an ESP32-WROOM-32 microcontroller communicating over micro-ROS to a host navigation workstation.

### Architecture Highlights
- **Microcontroller**: Dual-core ESP32 handling PID wheel speed closed-loop regulation and optical encoder interrupts at 100Hz.
- **Perception**: RPLiDAR A1 spinning at 5.5Hz (330 RPM) generating 8,000 laser range samples per second.
- **Chassis**: Custom laser-cut acrylic chassis with high-torque geared metal DC motors and planetary gearboxes.
- **Power Delivery**: 3S 18650 Li-ion battery pack with an integrated BMS and high-efficiency buck regulator step-down to 5V 4A.`,
    steps: [
      {
        stepNumber: 1,
        title: 'Chassis Assembly & Motor Mounting',
        description: 'Mount the twin 12V 330RPM geared motors to the baseplate using aluminum brackets. Attach the silicone high-traction wheels and wire the quadrature encoders to hardware interrupt pins.',
      },
      {
        stepNumber: 2,
        title: 'Power Distribution & Motor Driver Circuitry',
        description: 'Connect the 3S Li-ion battery pack through a 10A switch to an LM2596 buck converter tuned strictly to 5.05V. Connect the motor power leads to the TB6612FNG dual H-bridge motor driver.',
      },
      {
        stepNumber: 3,
        title: 'LiDAR Integration & UART Communication',
        description: 'Mount the RPLiDAR A1 on the elevated top tier. Connect TX/RX to ESP32 HardwareSerial pins 16 and 17, and configure PWM motor speed control pin to maintain a stable 300-360 RPM.',
      },
      {
        stepNumber: 4,
        title: 'Firmware Flash & micro-ROS Agent Pairing',
        description: 'Flash the dual-core C++ Arduino firmware. Start the micro-ROS agent via USB or WiFi UDP bridge and visualize real-time laser scan topics in RViz2.',
      },
    ],
    components: [
      { name: 'ESP32 Development Board (ESP-WROOM-32)', quantity: '1', link: 'https://amazon.com' },
      { name: 'Slamtec RPLiDAR A1M8 360° Rangefinder', quantity: '1', link: 'https://amazon.com' },
      { name: 'TB6612FNG Dual H-Bridge Motor Driver', quantity: '1', link: 'https://amazon.com' },
      { name: '12V DC Metal Gearmotors with Optical Encoders', quantity: '2', link: 'https://amazon.com' },
      { name: '3S 18650 Li-ion Battery Holder with 12V BMS', quantity: '1', link: 'https://amazon.com' },
      { name: 'LM2596 DC-DC Step Down Buck Converter', quantity: '2', link: 'https://amazon.com' },
    ],
    sourceCode: [
      {
        filename: 'rover_main.ino',
        language: 'cpp',
        code: `#include <WiFi.h>
#include <HardwareSerial.h>
#include <RPLidar.h>

#define MOTOR_A_PWM 25
#define MOTOR_A_IN1 26
#define MOTOR_A_IN2 27
#define MOTOR_B_PWM 14
#define MOTOR_B_IN1 12
#define MOTOR_B_IN2 13

RPLidar lidar;
HardwareSerial LidarSerial(2);

void setup() {
  Serial.begin(115200);
  LidarSerial.begin(115200, SERIAL_8N1, 16, 17);
  lidar.begin(LidarSerial);
  
  pinMode(MOTOR_A_PWM, OUTPUT);
  pinMode(MOTOR_A_IN1, OUTPUT);
  pinMode(MOTOR_A_IN2, OUTPUT);
  
  Serial.println("[SYSTEM] ESP32 LiDAR Rover Initialized.");
}

void loop() {
  if (IS_OK(lidar.waitPoint())) {
    float distance = lidar.getCurrentPoint().distance;
    float angle    = lidar.getCurrentPoint().angle;
    byte  quality  = lidar.getCurrentPoint().quality;
    
    if (quality > 10 && distance > 50 && distance < 6000) {
      // Process spatial point cloud
    }
  }
}`,
      },
    ],
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    instagramLink: 'https://instagram.com',
    likeCount: 42,
    likedBy: [],
    viewCount: 318,
    status: 'published',
    createdAt: new Date('2026-08-15'),
    updatedAt: new Date('2026-08-15'),
  },
  {
    _id: 'proj-smart-energy',
    title: 'Smart Home IoT Multi-Channel Energy Monitor',
    slug: 'smart-home-iot-energy-monitor',
    category: 'cat-iot',
    thumbnailImage: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
    ],
    shortDescription: 'Non-invasive whole-home AC energy meter utilizing SCT-013 current transformers, ESP32 ADC calibration, and MQTT telemetry streaming to Home Assistant.',
    fullDescription: `Track household electricity consumption across separate breaker circuits in real-time. This project uses non-invasive split-core current transformers (CTs) to measure AC current without stripping or cutting electrical wires.

### Key Capabilities
- **Non-Invasive Sensing**: 6x SCT-013-000 100A/50mA split core transformers clipped directly around insulated main lines.
- **Precise ADC Conditioning**: Dedicated DC bias voltage divider circuit and filtering capacitors to map bipolar AC currents safely into the ESP32's 0-3.3V range.
- **Home Assistant Auto-Discovery**: Streams real-time watts, apparent power, and kWh calculations via MQTT topics.`,
    steps: [
      {
        stepNumber: 1,
        title: 'Analog Signal Conditioning Circuit',
        description: 'Build a 1.65V DC offset reference using a 100kΩ voltage divider and 10µF stabilization capacitor to center the AC wave for ADC sampling.',
      },
      {
        stepNumber: 2,
        title: 'Burden Resistor Calculation',
        description: 'Solder a 33Ω 1% precision burden resistor in parallel with each current transformer to convert secondary current into a 0-1V RMS AC voltage.',
      },
      {
        stepNumber: 3,
        title: 'ESP32 ADC Sampling & RMS Integration',
        description: 'Implement a continuous 2000-sample window per 50/60Hz cycle in software to calculate accurate True-RMS current.',
      },
      {
        stepNumber: 4,
        title: 'Home Assistant MQTT Dashboard Setup',
        description: 'Configure Home Assistant MQTT sensor definitions with state_class: total_increasing for automatic Energy Dashboard tracking.',
      },
    ],
    components: [
      { name: 'ESP32 NodeMCU Development Module', quantity: '1' },
      { name: 'SCT-013-000 100A/50mA Split-Core Current Transformer', quantity: '4' },
      { name: '33Ω 1% Metal Film Precision Burden Resistors', quantity: '4' },
      { name: '10µF 25V Electrolytic Capacitors', quantity: '4' },
      { name: '100kΩ Resistors (Biasing Network)', quantity: '8' },
    ],
    sourceCode: [
      {
        filename: 'energy_monitor.ino',
        language: 'cpp',
        code: `#include <WiFi.h>
#include <PubSubClient.h>
#include "EmonLib.h"

EnergyMonitor emon1;
const int CT_PIN = 34;
const double ICAL = 29.0; // Calibration factor for 33 ohm burden

WiFiClient espClient;
PubSubClient client(espClient);

void setup() {
  Serial.begin(115200);
  emon1.current(CT_PIN, ICAL);
  Serial.println("[IoT] Energy Monitor active.");
}

void loop() {
  double Irms = emon1.calcIrms(1480); // Calculate Irms only
  double apparentPower = Irms * 230.0; // 230V mains
  Serial.printf("Current: %.2f A | Power: %.1f W\\n", Irms, apparentPower);
  delay(1000);
}`,
      },
    ],
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likeCount: 68,
    likedBy: [],
    viewCount: 524,
    status: 'published',
    createdAt: new Date('2026-08-28'),
    updatedAt: new Date('2026-08-28'),
  },
  {
    _id: 'proj-ble-node',
    title: 'Custom 4-Layer BLE Sensor Node with KiCAD & nRF52840',
    slug: 'custom-4-layer-ble-sensor-node-nrf52840',
    category: 'cat-electronics',
    thumbnailImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    detailImages: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    ],
    shortDescription: 'Ultra-compact Bluetooth Low Energy telemetry badge featuring Nordic nRF52840, BME688 gas sensor, and 3-year CR2450 coin cell battery life.',
    fullDescription: `Design a high-density, 4-layer custom printed circuit board (PCB) from schematic to SMD reflow. Powered by the Nordic Semiconductor nRF52840 ARM Cortex-M4 SoC, this wireless environmental node samples temperature, humidity, pressure, and VOC index while drawing under 4.2µA in deep sleep mode.

### Engineering Specs
- **Layer Stack**: Signal / Ground Plane / 3.3V Power Plane / Signal (Controlled impedance for 50Ω RF trace).
- **Antenna**: Matched meandered inverted-F trace antenna (MIFA) tuned with network analyzer.
- **Sensors**: Bosch BME688 environmental sensor with AI gas scanner.
- **Firmware**: Zephyr RTOS with BLE advertising beacon mode.`,
    steps: [
      {
        stepNumber: 1,
        title: 'KiCAD Schematic & RF Layout',
        description: 'Design the schematic with decoupling capacitors placed immediately adjacent to VDD pins. Route 50-ohm coplanar waveguide to the antenna with stitch vias.',
      },
      {
        stepNumber: 2,
        title: 'Stencil Solder Paste & Component Placement',
        description: 'Apply lead-free SAC305 solder paste using a stainless steel stencil, then place 0402 passives and QFN packages with micro-tweezers.',
      },
      {
        stepNumber: 3,
        title: 'Hot Air / Reflow Plate Soldering',
        description: 'Reflow using an aluminum PTC hot plate adhering to a controlled 3-stage thermal ramp profile.',
      },
      {
        stepNumber: 4,
        title: 'Zephyr RTOS Firmware Flashing',
        description: 'Connect J-Link probe over SWD to flash low-power BLE broadcast firmware.',
      },
    ],
    components: [
      { name: 'Nordic nRF52840-QIAA ARM Cortex-M4 SoC', quantity: '1' },
      { name: 'Bosch Sensortec BME688 Environmental Sensor', quantity: '1' },
      { name: '32.768 kHz & 32 MHz Crystals (10ppm)', quantity: '2' },
      { name: 'TPS62740 Ultra-Low IQ Buck Converter', quantity: '1' },
      { name: 'CR2450 SMD Coin Cell Clip', quantity: '1' },
    ],
    sourceCode: [
      {
        filename: 'prj.conf',
        language: 'ini',
        code: `CONFIG_BT=y
CONFIG_BT_DEVICE_NAME="TechCurious-Beacon"
CONFIG_BT_BROADCASTER=y
CONFIG_PM=y
CONFIG_PM_DEVICE=y
CONFIG_LOG=n`,
      },
      {
        filename: 'main.c',
        language: 'c',
        code: `#include <zephyr/kernel.h>
#include <zephyr/bluetooth/bluetooth.h>

static const struct bt_data ad[] = {
  BT_DATA_BYTES(BT_DATA_FLAGS, (BT_LE_AD_GENERAL | BT_LE_AD_NO_BREDR)),
  BT_DATA_BYTES(BT_DATA_NAME_COMPLETE, 'T', 'C', '-', 'S', 'e', 'n', 's', 'o', 'r'),
};

int main(void) {
  int err = bt_enable(NULL);
  if (err) return 0;
  
  bt_le_adv_start(BT_LE_ADV_NCONN, ad, ARRAY_SIZE(ad), NULL, 0);
  while (1) {
    k_sleep(K_SECONDS(10));
  }
  return 0;
}`,
      },
    ],
    youtubeLink: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    likeCount: 51,
    likedBy: [],
    viewCount: 402,
    status: 'published',
    createdAt: new Date('2026-09-02'),
    updatedAt: new Date('2026-09-02'),
  },
];
