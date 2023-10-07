import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Text,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios from "axios";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef(null);

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: "Hello! I'm HerbalLifeBot. How can I assist you today? I can provide herbal remedies based on various body parts and conditions.",
      isUser: false,
    };

    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
    console.log("sendMessage function triggered");
    if (inputText.trim() === "") return;

    const newMessage = {
      id: messages.length + 1,
      text: inputText,
      isUser: true,
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText("");
    scrollToBottom();

    setIsBotTyping(true);

    try {
      const response = await axios.post(
        "https://us-central1-fir-auth-b5f8a.cloudfunctions.net/dialogflowGateway",
        {
          text: inputText,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second

      const botResponse = {
        id: messages.length + 2,
        text: response.data.message,
        isUser: false,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsBotTyping(false);
    } catch (error) {
      setIsBotTyping(false);
      console.error("Error getting response from Dialogflow:", error);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.isUser ? styles.userMessage : styles.botMessage,
      ]}
      selectable={true}
    >
      <Text style={styles.messageText}>{item.text}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 170}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={scrollToBottom}
          onLayout={scrollToBottom}
          ListFooterComponent={() => {
            if (isBotTyping) {
              return (
                <View style={[styles.messageContainer, styles.botMessage]}>
                  <Text style={styles.messageText}>...</Text>
                </View>
              );
            } else {
              return null;
            }
          }}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Chat with the chatbot"
            value={inputText}
            onSubmitEditing={sendMessage}
            onChangeText={setInputText}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    height: "100%",
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "70%",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#DCF8C6",
  },
  botMessage: {
    alignSelf: "flex-start",
    backgroundColor: "white",
  },
  messageText: {
    fontSize: 16,
    color: "#333333",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: "#35D96F",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ChatScreen;
