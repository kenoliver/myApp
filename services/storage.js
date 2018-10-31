import { AsyncStorage } from "react-native";

export const setItem = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
} catch (error) {
    // console.error('AsyncStorage#setItem error: ' + error.message);
}
};

export const getItem = async(key ) => {
  let value = null;
  try {
    value = await AsyncStorage.getItem(key);
    if (value !== null) {
      value = JSON.parse(value);
    }
  } catch (error) {
    // Error retrieving data
  }
  return value;
};

export const  removeItem = async(key)=> {
  return await AsyncStorage.removeItem(key);
}
