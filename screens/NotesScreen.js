import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../firebase";
import { SafeAreaView } from "react-native";
import { TouchableOpacity } from "react-native";

function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const { width, height } = Dimensions.get("window");

  const openEditModal = (note) => {
    setCurrentNote(note);
    setEditModalVisible(true);
  };

  const saveEditedNote = () => {
    const updatedNotes = notes.map((note) => {
      if (note.id === currentNote.id) {
        return { ...currentNote, updatedAt: new Date() };
      }
      return note;
    });
    setNotes(updatedNotes);
    userRef
      .collection("notes")
      .doc(currentNote.id)
      .set(
        {
          herb: currentNote.herb,
          notes: currentNote.notes,
          updatedAt: new Date(),
        },
        { merge: true }
      )
      .then(() => {
        setEditModalVisible(false);
        Alert.alert("Note updated successfully!");
      })
      .catch((error) => {
        console.error("Error updating note:", error);
      });
  };

  const confirmDelete = (noteId) => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Deletion cancelled"),
          style: "cancel",
        },
        { text: "Yes", onPress: () => deleteNote(noteId) },
      ],
      { cancelable: true }
    );
  };
  const deleteNote = (noteId) => {
    userRef
      .collection("notes")
      .doc(noteId)
      .delete()
      .then(() => {
        console.log("Note successfully deleted!");
      })
      .catch((error) => {
        console.error("Error removing note: ", error);
      });
  };

  useEffect(() => {
    const unsubscribe = userRef.collection("notes").onSnapshot((snapshot) => {
      const fetchedNotes = snapshot.docs
        .map((doc) => {
          const data = doc.data();
          console.log(doc.id, data);

          const createdAt = data.createdAt?.toDate() ?? new Date();
          const updatedAt = data.updatedAt?.toDate();

          return {
            id: doc.id,
            ...data,
            createdAt,
            updatedAt,
          };
        })
        .sort((a, b) => {
          return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
        });
      setNotes(fetchedNotes);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (notes.length === 0) {
    return (
      <View style={{ flex: 1 }}>
        <Image
          source={require("../assets/noNotes.png")}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {notes.map((note) => (
        <View key={note.id} style={styles.note}>
          <View style={styles.noteTitleContainer}>
            <Text style={styles.noteTitle}>Herb: {note.herb}</Text>
            <AntDesign
              name="delete"
              size={24}
              color="red"
              onPress={() => confirmDelete(note.id)}
              style={{
                position: "absolute",
                marginLeft: "80%",
                alignItems: "center",
              }}
            />
            <AntDesign
              name="edit"
              size={24}
              color="blue"
              onPress={() => openEditModal(note)}
              style={{ alignItems: "center" }}
            />
          </View>

          <Text style={styles.noteDetail}>Notes: {note.notes}</Text>
          <Text style={styles.noteDetail}>
            {note.updatedAt
              ? `Last Edited on: ${note.updatedAt.toLocaleDateString()} at ${note.updatedAt.toLocaleTimeString(
                  [],
                  { hour: "numeric", minute: "2-digit" }
                )}`
              : `Created on: ${note.createdAt.toLocaleDateString()} at ${note.createdAt.toLocaleTimeString(
                  [],
                  { hour: "numeric", minute: "2-digit" }
                )}`}
          </Text>
        </View>
      ))}
      {editModalVisible && (
        <Modal
          animationType="fade" // or we can use slide
          visible={editModalVisible}
          onRequestClose={() => setEditModalVisible(false)}
        >
          <SafeAreaView style={styles.modal}>
            <Text style={styles.header}>Edit Note</Text>
            <Text style={styles.text}>Herb Name: {currentNote.herb}</Text>
            {/* <Text style={styles.text}>Condtion: {currentNote.condition}</Text> */}
            <TextInput
              value={currentNote.notes}
              onChangeText={(text) =>
                setCurrentNote((prev) => ({ ...prev, notes: text }))
              }
              placeholder="Notes"
              style={styles.input}
              textAlignVertical="top"
              multiline={true}
            />
            <TouchableOpacity
              onPress={saveEditedNote}
              style={styles.saveButton}
            >
              <Text style={styles.buttonText}>Save Note</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setEditModalVisible(false)}
              style={styles.closeButton}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </SafeAreaView>
        </Modal>
      )}
    </ScrollView>
  );
}

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  note: {
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#ddd",
  },
  noteTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  noteDetail: {
    fontSize: 16,
    marginBottom: 8,
  },
  modal: {
    margin: 20,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    elevation: 5,
  },
  header: {
    fontSize: 26,
    marginBottom: 20,
    fontWeight: "bold",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
  },
  input: {
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 15,
    marginBottom: 20,
    height: 100,
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
  },
  saveButton: {
    backgroundColor: "#4CAF50",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#FF5733",
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
  },
  text: {
    fontSize: 20,
    paddingVertical: 12,
  },
});
