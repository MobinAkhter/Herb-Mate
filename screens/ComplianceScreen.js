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
                  <Text style={styles.complianceText}>
                    The herbal content in this app is provided as general health
                    information only. It provides information on herbal remedies
                    as an alternative treatment, but it is not a substitute for
                    medical advice or treatment of any health condition. {"\n"}
                    {"\n"}
                    The team at HerbalLife makes no warranties about the
                    effectiveness of the remedies in curing your health
                    problems, so we do not assume any risk whatsoever for your
                    use of the information contained within the app. {"\n"}
                    {"\n"}You are hereby advised to consult with a herbalist or
                    other professionals in the healthcare industry before using
                    any of the information provided in this app. {"\n"}
                    {"\n"}By agreeing to the terms and conditions, and
                    registering to the app, you agree that neither the team at
                    HerbalLife nor any other party is or will be liable for any
                    decision you make based on the information provided in this
                    app.
                  </Text>
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      style={styles.checkbox}
                      disabled={false}
                      value={toggleCheckbox}
                      onValueChange={(newValue) => setToggleCheckbox(newValue)}
                    />
                    <Text>I agree to the terms and conditions</Text>
                  </View>
                  <TouchableOpacity
                    style={[
                      styles.registerButton,
                      {
                        backgroundColor: toggleCheckbox ? "lightblue" : "grey",
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
    color: "lightblue",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  complianceText: {
    fontSize: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginVertical: 30,
    alignItems: "center",
  },
  checkbox: {
    width: 25,
    height: 25,
    marginRight: 20,
  },
  registerButton: {
    marginTop: 20,
    padding: 20,
    borderRadius: 18,
  },
});
