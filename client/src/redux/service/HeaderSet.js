// import AsyncStorage from "@react-native-async-storage/async-storage";
// import Toast from "react-native-toast-message";

export async function SetHeader(headers) {
    
  try {
  //  const result = await AsyncStorage.getItem("userName");

    // if (result) {
      
     // const GetuserDetails = JSON.parse(result);
    
      headers.set('compcode', `AGFMGII`);
      headers.set('username', `Arun`);
      headers.set('Idcard', `123`);
    // }
  } catch (error) {
    console.error("Error reading user details from AsyncStorage:", error);
  }
  return headers;
}
