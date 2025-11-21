# Bluetooth API Guide

This guide explains how to use and extend the Bluetooth functionality in this app.

## Architecture Overview

The app uses `react-native-ble-plx` library for Bluetooth Low Energy operations:

```
BleManager (singleton)
    ├── Device Scanning
    ├── Device Connection
    └── Service/Characteristic Operations
```

## Key Concepts

### BLE Manager
The central manager for all Bluetooth operations. Created using `useRef` for proper lifecycle management.

### Device
Represents a discovered BLE peripheral with properties:
- `id`: Unique identifier (MAC address on Android, UUID on iOS)
- `name`: Device name (if available)
- `rssi`: Signal strength indicator

### Services and Characteristics
- **Service**: Group of characteristics (identified by UUID)
- **Characteristic**: Individual data point that can be read/written

## Common Operations

### 1. Scanning for Specific Devices

Filter by service UUID to find specific device types:

```typescript
const SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb'; // Heart Rate Service

bleManagerRef.current.startDeviceScan(
  [SERVICE_UUID], // Array of service UUIDs
  null,
  (error, device) => {
    // Handle discovered device
  }
);
```

### 2. Reading Characteristics

After connecting to a device:

```typescript
const SERVICE_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
const CHARACTERISTIC_UUID = '00002a37-0000-1000-8000-00805f9b34fb';

const characteristic = await device.readCharacteristicForService(
  SERVICE_UUID,
  CHARACTERISTIC_UUID
);

// Decode the value
const value = base64.decode(characteristic.value);
```

### 3. Writing to Characteristics

```typescript
const dataToWrite = base64.encode('Hello Device');

await device.writeCharacteristicWithResponseForService(
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
  dataToWrite
);
```

### 4. Monitoring Characteristics

Subscribe to characteristic notifications:

```typescript
device.monitorCharacteristicForService(
  SERVICE_UUID,
  CHARACTERISTIC_UUID,
  (error, characteristic) => {
    if (error) {
      console.error('Monitor error:', error);
      return;
    }
    
    const value = base64.decode(characteristic.value);
    console.log('Received:', value);
  }
);
```

## Extending the App

### Add Custom Device Features

1. **Identify Services and Characteristics**
   - Use a BLE scanner app to find UUIDs
   - Check device documentation

2. **Create a Custom Hook**
   ```typescript
   function useHeartRateMonitor(device: Device | null) {
     const [heartRate, setHeartRate] = useState(0);
     
     useEffect(() => {
       if (!device) return;
       
       const subscription = device.monitorCharacteristicForService(
         HEART_RATE_SERVICE_UUID,
         HEART_RATE_CHARACTERISTIC_UUID,
         (error, characteristic) => {
           if (!error && characteristic) {
             const value = decodeHeartRate(characteristic.value);
             setHeartRate(value);
           }
         }
       );
       
       return () => subscription.remove();
     }, [device]);
     
     return heartRate;
   }
   ```

3. **Add UI Components**
   Display the custom data in your UI

### Background Scanning

Enable in app.json:
```json
{
  "plugins": [
    [
      "react-native-ble-plx",
      {
        "isBackgroundEnabled": true,
        "modes": ["peripheral", "central"]
      }
    ]
  ]
}
```

Then implement background scanning logic.

## Common Patterns

### Connection State Management

```typescript
const [connectionState, setConnectionState] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');

const connectWithState = async (device: Device) => {
  setConnectionState('connecting');
  try {
    const connected = await bleManager.connectToDevice(device.id);
    setConnectionState('connected');
    return connected;
  } catch (error) {
    setConnectionState('disconnected');
    throw error;
  }
};
```

### Error Handling

```typescript
try {
  await device.readCharacteristicForService(serviceUUID, charUUID);
} catch (error: any) {
  if (error.errorCode === BleErrorCode.DeviceDisconnected) {
    Alert.alert('Device disconnected');
  } else if (error.errorCode === BleErrorCode.CharacteristicNotFound) {
    Alert.alert('Feature not supported');
  } else {
    Alert.alert('Error', error.message);
  }
}
```

## Best Practices

1. **Always check permissions** before scanning or connecting
2. **Handle device disconnection** gracefully with reconnection logic
3. **Stop scanning** when you find the device you need
4. **Filter by service UUIDs** to reduce power consumption
5. **Clean up subscriptions** in useEffect return functions
6. **Use timeouts** for operations that might hang
7. **Handle errors** at every async operation
8. **Test on real devices** - simulators have limited BLE support

## Debugging Tips

1. **Enable verbose logging:**
   ```typescript
   bleManager.setLogLevel('Verbose');
   ```

2. **Use BLE scanner apps** to verify device advertising
3. **Check platform-specific docs** for iOS and Android differences
4. **Monitor device logs** using `adb logcat` (Android) or Console.app (iOS)

## Resources

- [react-native-ble-plx documentation](https://github.com/dotintent/react-native-ble-plx)
- [Bluetooth Core Specification](https://www.bluetooth.com/specifications/specs/)
- [Common GATT Services](https://www.bluetooth.com/specifications/gatt/services/)
- [Expo documentation](https://docs.expo.dev/)

## Example: Complete Feature Implementation

See `examples/` directory (if available) for complete implementations of:
- Heart rate monitoring
- Temperature sensing
- Custom device control
- OTA firmware updates
