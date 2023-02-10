import { StyleSheet, View, Text, TextInput } from "react-native";




function AppSettings(){

    return(
        <>
        
            <Text> App Settings</Text>
       
            
            
        </>
    )
}

export default AppSettings

const styles = StyleSheet.create({
    centered: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#ffc2c2",
    },
    title: {
      fontSize: 18,
      marginVertical: 2,
    },
    subtitle: {
      fontSize: 14,
      color: "#888",
    },
  });