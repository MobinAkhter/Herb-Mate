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

const TypingIndicator = () => {
  const [dots, setDots] = useState("");
  useEffect(() => {
    let mounted = true;
    const intervalId = setInterval(() => {
      if (mounted) {
        setDots((prevDots) => (prevDots.length < 3 ? prevDots + "." : ""));
      }
    }, 500);
    return () => {
      mounted = false;
      clearInterval(intervalId);
    };
  }, []);
  return <Text style={styles.typingIndicatorText}>{dots}</Text>;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const flatListRef = useRef(null);
  const [sendButtonPressed, setSendButtonPressed] = useState(false);

  useEffect(() => {
    const welcomeMessage = {
      id: 1,
      text: "Hello! I'm Herb Mate Bot. How can I assist you today? I can provide herbal remedies based on various body parts and conditions.",
      isUser: false,
    };
    setMessages([welcomeMessage]);
  }, []);

  const sendMessage = async () => {
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
        { text: inputText }
      );
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const botResponse = {
        id: messages.length + 2,
        text: response.data.message,
        isUser: false,
      };
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      setIsBotTyping(false);
    } catch (error) {
      console.error("Error getting response from Dialogflow:", error);
      setIsBotTyping(false);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderItem = ({ item }) => (
    <View style={item.isUser ? styles.userMessageRow : styles.botMessageRow}>
      {!item.isUser && <View style={styles.botMessageTail} />}
      <View
        style={[
          styles.messageBubble,
          item.isUser ? styles.userMessageBubble : styles.botMessageBubble,
        ]}
      >
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
      {item.isUser && <View style={styles.userMessageTail} />}
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
          ListFooterComponent={() => isBotTyping && <TypingIndicator />}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type your question here..."
            value={inputText}
            onSubmitEditing={sendMessage}
            onChangeText={setInputText}
            multiline={true}
            numberOfLines={4}
            textAlignVertical="top"
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              { opacity: sendButtonPressed ? 0.7 : 1 },
            ]}
            onPressIn={() => setSendButtonPressed(true)}
            onPressOut={() => setSendButtonPressed(false)}
            onPress={sendMessage}
          >
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  messagesContainer: {
    padding: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#DDDDDD",
    backgroundColor: "white",
    padding: 10,
  },
  input: {
    marginLeft: 4,
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: "#CCCCCC",
    borderRadius: 4,
    marginRight: 16,
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
  userMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  botMessageRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    marginVertical: 4,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 10,
    elevation: 1,
    minWidth: "10%",
    maxWidth: "80%",
    margin: 5,
  },
  userMessageBubble: {
    backgroundColor: "#DCF8C6",
    borderBottomRightRadius: 0,
    marginRight: 5,
  },
  botMessageBubble: {
    backgroundColor: "white",
    borderBottomLeftRadius: 0,
    marginLeft: 5,
  },
  userMessageTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: "transparent",
    borderTopColor: "#DCF8C6",
    borderBottomLeftRadius: 20,
    position: "absolute",
    right: -10,
    bottom: 0,
  },
  botMessageTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 20,
    borderTopWidth: 20,
    borderLeftColor: "transparent",
    borderTopColor: "white",
    borderBottomRightRadius: 20,
    position: "absolute",
    left: -10,
    bottom: 0,
  },
  messageText: {
    color: "#333333",
    fontSize: 16,
  },
  typingIndicatorText: {
    fontSize: 24,
    color: "#333333",
  },
});

export default ChatScreen;
