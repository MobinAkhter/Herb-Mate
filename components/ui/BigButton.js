import { Pressable, StyleSheet, Text, View } from "react-native";

function BigButton({ children, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={onPress}
    >
      <View>
        <Text style={styles.buttonText}>{children}</Text>
      </View>
    </Pressable>
  );
}

export default BigButton;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "white",
    elevation: 2,
    width: 300,
    height: 65,
    shadowColor: "black",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    marginTop: 30,
    alignItems: "center",
    borderColor: "#35D96F",
    borderWidth: 3,
  },
  pressed: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: 27,
    fontWeight: "bold",
  },
});
