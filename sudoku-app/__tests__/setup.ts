// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  mergeItem: jest.fn(),
}));

// Mock Firebase - comment out to avoid hanging
// jest.mock('firebase/app', () => ({
//   initializeApp: jest.fn(),
// }));

// jest.mock('firebase/database', () => ({
//   getDatabase: jest.fn(),
//   ref: jest.fn(),
//   set: jest.fn(),
//   get: jest.fn(),
//   onValue: jest.fn(),
//   off: jest.fn(),
// }));

// Mock Zustand - don't mock, use real zustand
// Zustand works fine in tests, no mocking needed

// Mock device
jest.mock('expo-device', () => ({
  deviceName: 'Test Device',
  modelName: 'iPhone 15',
}));

// Suppress console warnings in tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};
