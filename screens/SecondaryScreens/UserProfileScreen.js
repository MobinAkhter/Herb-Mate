import React, { useState, useEffect, useContext, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { UserContext } from "../../contexts/userContext";
import { auth, db } from "../../firebase";
import {
  signOut,
  reauthenticateWithCredential,
  updatePassword,
  EmailAuthProvider,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

function UserProfileScreen({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [userData, setUserData] = useState(null);
  const [newFirstName, setFirstName] = useState("");
  const [newLastName, setLastName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditingFirstName, setEditingFirstName] = useState(false);
  const [isEditingLastName, setEditingLastName] = useState(false);

  // const firestore = firebase.firestore();
  // const auth = firebase.auth();
  const authId = auth.currentUser ? auth.currentUser.uid : null;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "User Profile",
      headerRight: () => (
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  useEffect(() => {
    if (auth.currentUser) {
      const userRef = doc(db, "users", auth.currentUser.uid);
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          const userDocData = docSnap.data();
          setUserData(userDocData);
          setFirstName(userDocData.firstName);
          setLastName(userDocData.lastName);
        }
      });
    }
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate("Login");
      setUser(null);
    } catch (error) {
      // Handle any errors
      console.error(error);
    }
  };

  const updateUserField = async (field, value) => {
    const userRef = doc(db, "users", auth.currentUser.uid);
    await setDoc(userRef, { [field]: value }, { merge: true });
    await firestore
      .collection("users")
      .doc(authId)
      .set({ [field]: value }, { merge: true });
    Alert.alert("Success", "Profile updated successfully.");
    if (field === "firstName") {
      setEditingFirstName(false);
      setUserData({ ...userData, firstName: value });
    } else if (field === "lastName") {
      setEditingLastName(false);
      setUserData({ ...userData, lastName: value });
    }
  };
  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      const user = auth.currentUser;
      if (user) {
        const credentials = EmailAuthProvider.credential(
          user.email,
          oldPassword
        );
        await reauthenticateWithCredential(user, credentials);
        await updatePassword(user, newPassword);
        Alert.alert("Success", "Password updated successfully.");
        setModalVisible(false);
      }
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={styles.container}>
      <FieldWithEdit
        label="First Name"
        isEditing={isEditingFirstName}
        value={newFirstName}
        onSave={(value) => updateUserField("firstName", value)}
        onCancel={() => setEditingFirstName(false)}
        onEdit={() => setEditingFirstName(true)}
        onChangeText={setFirstName}
      />
      <FieldWithEdit
        label="Last Name"
        isEditing={isEditingLastName}
        value={newLastName}
        onSave={(value) => updateUserField("lastName", value)}
        onCancel={() => setEditingLastName(false)}
        onEdit={() => setEditingLastName(true)}
        onChangeText={setLastName}
      />
      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => setModalVisible(true)}
      >
        <Icon name="lock" size={20} style={styles.buttonIcon} />
        <Text style={styles.btnText}>Change Password</Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        <View style={styles.modalContent}>
          <TextInput
            placeholder="Old Password"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="New Password"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            style={styles.modalInput}
          />
          <TextInput
            placeholder="Confirm New Password"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            style={styles.modalInput}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={handleChangePassword}
          >
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const FieldWithEdit = ({
  label,
  isEditing,
  value,
  onSave,
  onCancel,
  onEdit,
  onChangeText,
}) => (
  <View style={styles.fieldContainer}>
    <Text style={styles.text}>{label}:</Text>
    {isEditing ? (
      <>
        <TextInput
          style={styles.textInput}
          value={value}
          onChangeText={onChangeText}
          autoFocus
        />
        <TouchableOpacity onPress={() => onSave(value)} style={styles.saveIcon}>
          <Icon name="check" size={20} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel} style={styles.cancelIcon}>
          <Icon name="times" size={20} />
        </TouchableOpacity>
      </>
    ) : (
      <>
        <Text style={styles.textValue}>{value}</Text>
        <TouchableOpacity onPress={onEdit} style={styles.editIcon}>
          <Icon name="pencil" size={20} />
        </TouchableOpacity>
      </>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  continueButton: {
    flexDirection: "row",
    backgroundColor: "#1E6738",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  btnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  buttonIcon: {
    marginRight: 10,
    color: "white",
  },
  fieldContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textInput: {
    flex: 1,
    padding: 10,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  textValue: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  editIcon: {
    padding: 10,
  },
  saveIcon: {
    padding: 10,
  },
  cancelIcon: {
    padding: 10,
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
  },
  modalInput: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#1E6738",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    padding: 11,
    textAlign: "center",
  },
});

export default UserProfileScreen;
