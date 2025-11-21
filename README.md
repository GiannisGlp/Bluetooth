# Bluetooth React Native App

A React Native application built with Expo that demonstrates Bluetooth Low Energy (BLE) functionality. This app allows users to scan for nearby Bluetooth devices, connect to them, and manage connections.

## Features

- 🔍 **Bluetooth Device Scanning**: Discover nearby BLE devices
- 🔗 **Device Connection**: Connect to discovered Bluetooth devices
- 📱 **Cross-Platform**: Works on both iOS and Android
- 🎨 **Modern UI**: Clean and intuitive user interface
- ⚡ **Real-time Updates**: Live device discovery and connection status
- 🔐 **Permission Handling**: Automatic request for necessary Bluetooth permissions

## Prerequisites

- Node.js (v20 or higher)
- npm or yarn
- Expo CLI
- For iOS: Xcode and iOS Simulator or physical iOS device
- For Android: Android Studio and Android Emulator or physical Android device

## Installation

1. Clone the repository:
```bash
git clone https://github.com/GiannisGlp/Bluetooth.git
cd Bluetooth
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

## Running the App

### On Android
```bash
npm run android
```

### On iOS
```bash
npm run ios
```

### On Web (Limited Bluetooth Support)
```bash
npm run web
```

## Permissions

### Android
The app requires the following permissions:
- `BLUETOOTH` - Basic Bluetooth functionality
- `BLUETOOTH_ADMIN` - Bluetooth management
- `BLUETOOTH_SCAN` - Scan for Bluetooth devices (Android 12+)
- `BLUETOOTH_CONNECT` - Connect to Bluetooth devices (Android 12+)
- `ACCESS_FINE_LOCATION` - Required for BLE scanning
- `ACCESS_COARSE_LOCATION` - Alternative location permission

### iOS
The app requires:
- `NSBluetoothAlwaysUsageDescription` - Bluetooth usage permission
- `NSBluetoothPeripheralUsageDescription` - Bluetooth peripheral usage

## How to Use

1. **Start the App**: Launch the app on your device
2. **Enable Bluetooth**: Make sure Bluetooth is enabled on your device
3. **Grant Permissions**: Accept all permission requests when prompted
4. **Scan for Devices**: Tap the "Start Scan" button to discover nearby Bluetooth devices
5. **Connect**: Tap on any discovered device to connect to it
6. **Disconnect**: Use the "Disconnect" button to terminate the connection

## Technology Stack

- **React Native**: Mobile app framework
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe JavaScript
- **react-native-ble-plx**: Bluetooth Low Energy library
- **expo-device**: Device information utilities

## Project Structure

```
Bluetooth/
├── App.tsx              # Main application component with Bluetooth logic
├── app.json            # Expo configuration and permissions
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── assets/             # App icons and images
└── README.md          # This file
```

## Key Components

### BleManager
Manages all Bluetooth operations including scanning, connecting, and device management.

### Main Features

1. **Device Scanning**
   - Scans for 10 seconds
   - Filters devices with names
   - Displays device name, ID, and signal strength (RSSI)

2. **Connection Management**
   - Connect to any discovered device
   - Automatic service and characteristic discovery
   - Disconnect functionality

3. **Permission Handling**
   - Android 12+ (API 31+) specific permissions
   - Legacy Android permissions
   - iOS permission descriptions

## Troubleshooting

### Bluetooth not working
- Ensure Bluetooth is enabled on your device
- Check that location services are enabled (Android)
- Verify all permissions have been granted

### No devices found
- Make sure nearby Bluetooth devices are turned on and discoverable
- Check if the devices support Bluetooth Low Energy (BLE)
- Try moving closer to the devices

### Connection failures
- Device might be out of range
- Device might already be connected to another app
- Try restarting Bluetooth on both devices

## Development

To extend the app:

1. **Add Custom Services**: Modify the `connectToDevice` function to work with specific GATT services
2. **Read/Write Characteristics**: Use BleManager methods to interact with device characteristics
3. **Background Scanning**: Enable background scanning in app.json configuration
4. **Add Filtering**: Filter devices by service UUID or other criteria

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

Or use EAS Build for modern Expo apps:
```bash
npx eas-cli build --platform android
npx eas-cli build --platform ios
```

## License

MIT License - feel free to use this project for learning and development.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please open an issue on the GitHub repository.
