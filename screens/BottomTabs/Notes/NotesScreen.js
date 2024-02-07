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
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../../../firebase";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  useEffect(() => {
    const notesRef = collection(db, "users", auth.currentUser.uid, "notes");
    const unsubscribe = onSnapshot(notesRef, (snapshot) => {
      const fetchedNotes = [];
      snapshot.forEach((doc) => {
        const noteData = doc.data();
        fetchedNotes.push({
          id: doc.id,
          ...noteData,
          createdAt: noteData.createdAt?.toDate(),
          updatedAt: noteData.updatedAt?.toDate(),
        });
      });
      setNotes(fetchedNotes.sort((a, b) => b.updatedAt - a.updatedAt));
      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleEditModal = (note) => {
    setCurrentNote(note);
    setEditModalVisible(true);
  };

  const handleSaveNote = async () => {
    const noteRef = doc(
      db,
      "users",
      auth.currentUser.uid,
      "notes",
      currentNote.id
    );
    await updateDoc(noteRef, {
      ...currentNote,
      updatedAt: new Date(),
    });
    setEditModalVisible(false);
    Alert.alert("Note updated successfully!");
  };

  const handleDeleteNote = async (noteId) => {
    const noteRef = doc(db, "users", auth.currentUser.uid, "notes", noteId);
    await deleteDoc(noteRef);
    Alert.alert("Note deleted successfully!");
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (notes.length === 0) {
    return (
      <View style={styles.fullScreen}>
        <Image
          source={require("../../../assets/noNotes.png")}
          style={styles.fullScreenImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {notes.map((note) => (
        <View key={note.id} style={styles.noteContainer}>
          <View style={styles.noteTitleRow}>
            <Text style={styles.noteTitle}>Herb: {note.herb}</Text>
            <AntDesign
              name="delete"
              size={24}
              color="red"
              onPress={() => handleDeleteNote(note.id)}
              style={styles.icon}
            />
            <AntDesign
              name="edit"
              size={24}
              color="blue"
              onPress={() => handleEditModal(note)}
              style={styles.icon}
            />
          </View>
          <Text style={styles.noteText}>Notes: {note.notes}</Text>
          <Text style={styles.noteText}>
            Last Edited:{" "}
            {note.updatedAt
              ? note.updatedAt.toLocaleDateString() +
                " " +
                note.updatedAt.toLocaleTimeString()
              : "N/A"}
          </Text>
        </View>
      ))}
      <Modal
        animationType="fade"
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Edit Note</Text>
          <TextInput
            value={currentNote.notes}
            onChangeText={(text) =>
              setCurrentNote({ ...currentNote, notes: text })
            }
            placeholder="Notes"
            style={styles.modalInput}
            multiline
          />
          <TouchableOpacity onPress={handleSaveNote} style={styles.saveButton}>
            <Text style={styles.buttonText}>Save Note</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setEditModalVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
