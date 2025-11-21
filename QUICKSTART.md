# Quick Start Guide

## Getting Started in 5 Minutes

This guide will help you get the Bluetooth app running on your device quickly.

### Prerequisites
- Node.js installed (v20+)
- A physical Android or iOS device (Bluetooth doesn't work well in simulators)
- Expo Go app installed on your device ([Android](https://play.google.com/store/apps/details?id=host.exp.exponent) | [iOS](https://apps.apple.com/app/expo-go/id982107779))

### Setup Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start the Development Server**
   ```bash
   npm start
   ```

3. **Connect Your Device**
   - Open the Expo Go app on your device
   - Scan the QR code shown in the terminal
   - Wait for the app to load

4. **Test Bluetooth Functionality**
   - Grant all permissions when prompted
   - Enable Bluetooth on your device
   - Tap "Start Scan" to discover nearby devices
   - Tap on any device to connect to it

### Troubleshooting

**"Bluetooth Off" message:**
- Enable Bluetooth in your device settings

**No devices found:**
- Make sure nearby Bluetooth devices are turned on
- Ensure they support Bluetooth Low Energy (BLE)
- Try moving closer to the devices

**Permission denied:**
- Go to device Settings > Apps > Expo Go
- Grant all Bluetooth and Location permissions

### Building Standalone Apps

For testing with full permissions without Expo Go:

**Android:**
```bash
npx expo run:android
```

**iOS:**
```bash
npx expo run:ios
```

Note: This requires Android Studio or Xcode installed.

### Next Steps

- Check out the full README.md for detailed documentation
- Modify App.tsx to add custom Bluetooth features
- Filter devices by service UUID for specific devices
- Implement characteristic read/write operations

### Need Help?

- See README.md for comprehensive documentation
- Check the [react-native-ble-plx documentation](https://github.com/dotintent/react-native-ble-plx)
- Open an issue on GitHub for problems
