import AsyncStorage from '@react-native-async-storage/async-storage';

const prefix = 'earbridge:';

export async function getJson(key, defaultValue) {
  try {
    const raw = await AsyncStorage.getItem(prefix + key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch {
    return defaultValue;
  }
}

export async function setJson(key, value) {
  await AsyncStorage.setItem(prefix + key, JSON.stringify(value));
}

export async function removeKey(key) {
  await AsyncStorage.removeItem(prefix + key);
}

