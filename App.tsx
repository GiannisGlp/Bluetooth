import React, { useState, useEffect, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Alert,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import { BleManager, Device, State } from 'react-native-ble-plx';
import * as ExpoDevice from 'expo-device';

// Constants
const SCAN_TIMEOUT_MS = 10000;

export default function App() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [bluetoothState, setBluetoothState] = useState<State>(State.Unknown);
  
  // Use ref to manage BleManager lifecycle properly
  const bleManagerRef = useRef<BleManager | null>(null);

  useEffect(() => {
    // Initialize BleManager
    bleManagerRef.current = new BleManager();
    
    // Subscribe to Bluetooth state changes
    const subscription = bleManagerRef.current.onStateChange((state) => {
      setBluetoothState(state);
      if (state === State.PoweredOn) {
        console.log('Bluetooth is powered on');
      }
    }, true);

    return () => {
      subscription.remove();
      if (bleManagerRef.current) {
        bleManagerRef.current.destroy();
      }
    };
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      if ((ExpoDevice.platformApiLevel ?? -1) < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted = await requestAndroid31Permissions();
        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Bluetooth Scan Permission',
        message: 'App requires Bluetooth Scan',
        buttonPositive: 'OK',
      }
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Bluetooth Connect Permission',
        message: 'App requires Bluetooth Connect',
        buttonPositive: 'OK',
      }
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      }
    );

    return (
      bluetoothScanPermission === PermissionsAndroid.RESULTS.GRANTED &&
      bluetoothConnectPermission === PermissionsAndroid.RESULTS.GRANTED &&
      fineLocationPermission === PermissionsAndroid.RESULTS.GRANTED
    );
  };

  const scanForDevices = async () => {
    if (!bleManagerRef.current) return;
    
    const isPermissionsEnabled = await requestPermissions();
    if (!isPermissionsEnabled) {
      Alert.alert('Permissions Required', 'Please enable Bluetooth permissions');
      return;
    }

    if (bluetoothState !== State.PoweredOn) {
      Alert.alert('Bluetooth Off', 'Please turn on Bluetooth');
      return;
    }

    setIsScanning(true);
    setDevices([]);

    // Scan for all BLE devices
    // Note: For production, consider filtering by specific service UUIDs to improve performance
    bleManagerRef.current.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('Scan error:', error);
        setIsScanning(false);
        return;
      }

      if (device && device.name) {
        setDevices((prevDevices) => {
          const deviceExists = prevDevices.find((d) => d.id === device.id);
          if (!deviceExists) {
            return [...prevDevices, device];
          }
          return prevDevices;
        });
      }
    });

    // Stop scanning after defined timeout
    setTimeout(() => {
      if (bleManagerRef.current) {
        bleManagerRef.current.stopDeviceScan();
      }
      setIsScanning(false);
    }, SCAN_TIMEOUT_MS);
  };

  const stopScan = () => {
    if (bleManagerRef.current) {
      bleManagerRef.current.stopDeviceScan();
    }
    setIsScanning(false);
  };

  const connectToDevice = async (device: Device) => {
    if (!bleManagerRef.current) return;
    
    try {
      stopScan();
      const connected = await bleManagerRef.current.connectToDevice(device.id);
      setConnectedDevice(connected);
      await connected.discoverAllServicesAndCharacteristics();
      Alert.alert('Success', `Connected to ${device.name || 'Unknown Device'}`);
    } catch (error) {
      console.error('Connection error:', error);
      Alert.alert('Error', 'Failed to connect to device');
    }
  };

  const disconnectDevice = async () => {
    if (!bleManagerRef.current || !connectedDevice) return;
    
    try {
      await bleManagerRef.current.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      Alert.alert('Disconnected', 'Device disconnected successfully');
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  };

  const renderDevice = ({ item }: { item: Device }) => (
    <TouchableOpacity
      style={styles.deviceItem}
      onPress={() => connectToDevice(item)}
    >
      <Text style={styles.deviceName}>{item.name || 'Unknown Device'}</Text>
      <Text style={styles.deviceId}>{item.id}</Text>
      {item.rssi && <Text style={styles.rssi}>RSSI: {item.rssi}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Bluetooth Scanner</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>
          Bluetooth: {bluetoothState === State.PoweredOn ? '🟢 On' : '🔴 Off'}
        </Text>
        {connectedDevice && (
          <Text style={styles.connectedText}>
            Connected to: {connectedDevice.name || 'Unknown'}
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {!isScanning ? (
          <TouchableOpacity style={styles.scanButton} onPress={scanForDevices}>
            <Text style={styles.buttonText}>Start Scan</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.scanButton, styles.stopButton]} onPress={stopScan}>
            <Text style={styles.buttonText}>Stop Scan</Text>
          </TouchableOpacity>
        )}

        {connectedDevice && (
          <TouchableOpacity
            style={[styles.scanButton, styles.disconnectButton]}
            onPress={disconnectDevice}
          >
            <Text style={styles.buttonText}>Disconnect</Text>
          </TouchableOpacity>
        )}
      </View>

      {isScanning && <Text style={styles.scanningText}>Scanning...</Text>}

      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={renderDevice}
        style={styles.deviceList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {isScanning ? 'Searching for devices...' : 'No devices found. Tap "Start Scan" to begin.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  connectedText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  scanButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  stopButton: {
    backgroundColor: '#FF9800',
  },
  disconnectButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  scanningText: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 10,
    fontSize: 14,
  },
  deviceList: {
    flex: 1,
  },
  deviceItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  deviceName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  deviceId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 3,
  },
  rssi: {
    fontSize: 12,
    color: '#999',
  },
  emptyText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 40,
  },
});
