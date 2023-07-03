import { StyleSheet, TextInput } from "react-native";

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
  searchInput: {
    height: 35,
    fontSize: 22,
    width: "80%",
  },
});
