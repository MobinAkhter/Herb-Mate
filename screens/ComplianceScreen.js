import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Modal,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import Checkbox from "expo-checkbox";
import { useNavigation } from "@react-navigation/native";

// import text from "../constants/text";

const ComplianceScreen = () => {
  const [toggleCheckbox, setToggleCheckbox] = useState(false);
  const [complianceModal, setComplianceModal] = useState(true);
  const navigation = useNavigation();

  return (
    <View style={styles.mainContainer}>
      <View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={complianceModal}
        >
          <SafeAreaView>
            <ScrollView>
              <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                  <Text style={styles.modalComplianceTitle}>
                    Medical Disclosure
                  </Text>
                  <Text>
                    Hello, Mobin. Hopefully, this works and the user is able to
                    see the terms of conditions modal.\n I hope you are having a
                    great all nighter working on this for the domain expert
                    meeting tomrrow!\n Make sure to update this text before then
                    so that you can show it and ask for feedback.\n That being
                    said, LFG!!!
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      disabled={false}
                      value={toggleCheckbox}
                      onValueChange={(newValue) => setToggleCheckbox(newValue)}
                    />
                    <Text>I agreee to the terms and conditions</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      {
                        backgroundColor: toggleCheckbox ? "dodgerblue" : "grey",
                      },
                    ]}
                    disabled={!toggleCheckbox}
                    onPress={() =>
                      setComplianceModal(false) || navigation.navigate("Signup")
                    }
                  >
                    <Text>Continue to register</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </SafeAreaView>
        </Modal>
      </View>
    </View>
  );
};

export default ComplianceScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  googleText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    margin: 20,
    padding: 20,
    alignItems: "center",
  },
  modalComplianceTitle: {
    marginBottom: 20,
    color: "dodgerblue",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 30,
    alignItems: "center",
  },
  checkbox: {
    width: 30,
    height: 30,
    marginRight: 20,
  },
  registerButton: {
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
  },
});
