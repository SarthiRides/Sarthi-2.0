import axios from 'axios';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const getExpoHost = () => {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    '';

  return hostUri ? hostUri.split(':')[0] : null;
};

const getApiBaseUrl = () => {
  if (!__DEV__) {
    return 'https://your-production-api.com/api';
  }

  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  if (Platform.OS === 'web') {
    return 'http://localhost:3001/api';
  }

  const expoHost = getExpoHost();
  if (expoHost) {
    return `http://${expoHost}:3001/api`;
  }

  return Platform.select({
    android: 'http://10.0.2.2:3001/api',
    ios: 'http://localhost:3001/api',
    default: 'http://localhost:3001/api',
  });
};

const API_BASE_URL = getApiBaseUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;

