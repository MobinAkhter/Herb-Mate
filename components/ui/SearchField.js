import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { Colors } from "../../constants/styles";

function SearchField({ children, value }) {
  return (
    <TextInput
      keyboardType="default"
      placeholder={children}
      style={styles.searchInput}
      value={value}
    ></TextInput>
  );
}

export default SearchField;

const styles = StyleSheet.create({
  //   search: {
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "center",
  //     borderRadius: 20,
  //     borderWidth: 1,
  //     borderColor: "blue",
  //     backgroundColor: "lightgray",
  //   },
  searchInput: {
    height: 35,
    //borderRadius: 50,
    fontSize: 22,
    width: "80%",
    //backgroundColor: "lightgray",
  },
});
