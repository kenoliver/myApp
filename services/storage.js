import { AsyncStorage } from "react-native";

export const setItem = async (key, value) => {
  try {
    return await AsyncStorage.setItem(key, JSON.stringify(value));
} catch (error) {
    // console.error('AsyncStorage#setItem error: ' + error.message);
}
};

export const getItem = async(key) => {
  var value =''
  try {
    value = await  AsyncStorage.getItem(key) || "none" ;
    value = (value==="none") ? "none" : JSON.parse(value)
  
  } catch (error) {
    // Error retrieving data
  }
 return value
};

export const  removeItem = async(key)=> {
  return await AsyncStorage.removeItem(key);
}
