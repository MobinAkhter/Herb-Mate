import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";

import { Colors } from "../../constants/styles";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
function Input({
  label,
  keyboardType,
  secure,
  onUpdateValue,
  value,
  isInvalid,
  placeholder,
}) {
  const [isSecureEntry, setIsSecureEntry] = useState(secure);
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, isInvalid && styles.labelInvalid]}>
        {label}
      </Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={[styles.input, isInvalid && styles.inputInvalid]}
          autoCapitalize="none"
          keyboardType={keyboardType}
          secureTextEntry={isSecureEntry}
          onChangeText={onUpdateValue}
          value={value}
          placeholder={placeholder}
        />
        {secure && (
          <TouchableOpacity
            onPress={() => setIsSecureEntry((prev) => !prev)}
            style={styles.toggleIcon}
          >
            <MaterialIcons
              name={isSecureEntry ? "visibility-off" : "visibility"}
              size={20}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 8,
  },
  textInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 4,
  },
  label: {
    color: "white",
    marginBottom: 4,
    fontWeight: "bold",
  },
  labelInvalid: {
    color: "red",
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    fontSize: 16,
  },
  inputInvalid: {
    backgroundColor: "yourErrorColor", // Set your error background color
  },
  toggleIcon: {
    padding: 10,
  },
});
