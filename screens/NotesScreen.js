import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { db, auth } from "../firebase";

function NotesScreen() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const user = auth.currentUser.uid;
  const userRef = db.collection("users").doc(user);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState(null);

  const openEditModal = (note) => {
    setCurrentNote(note);
    setEditModalVisible(true);
  };

  const saveEditedNote = () => {
    userRef
      .collection("notes")
      .doc(currentNote.id)
      .set({
        herb: currentNote.herb,
        condition: currentNote.condition,
        notes: currentNote.notes,
      })
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
      const fetchedNotes = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotes(fetchedNotes);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
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

          {note.condition && (
            <Text style={styles.noteDetail}>Condition: {note.condition}</Text>
          )}
          <Text style={styles.noteDetail}>Notes: {note.notes}</Text>
          {/* <Text style={styles.noteDetail}>
            Created on: {new Date(note.createdAt).toLocaleDateString()}
          </Text> */}
        </View>
      ))}
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
});
