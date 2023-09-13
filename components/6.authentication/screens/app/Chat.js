import React, { useContext, useEffect, useState, useRef } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Button,
  Modal,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

export const Chat = () => {
  const { handleLogout, accessToken } = useContext(AuthContext);
  const [data, setData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [message, setMessage] = useState("");
  const [isFecthing, setIsFetching] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [page, setPage] = useState(1);

  const flatListRef = useRef(null);

  const handleSend = async () => {
    if (message.trim().length > 0) {
      const newMessage = {
        content: message,
      };
      try {
        const res = await fetch(
          "https://chat-api-with-auth.up.railway.app/messages",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify(newMessage),
          }
        );

        if (res.ok === true) {
          setData((prevData) => [
            ...prevData,
            {
              user: {
                _id: userId,
                username: "Me",
              },
              content: message,
              date: new Date().getDate(),
            },
          ]);
          setIsFetching(true);
          flatListRef.current.scrollToEnd({ animated: true });
          setMessage("");
        } else {
          console.log("server responsed with an error!!");
        }
      } catch (error) {
        console.log("Error sending the chat message.", error);
      }
    }
  };

  useEffect(() => {
    const fetchUserId = async () => {
      const user = await AsyncStorage.getItem("userId");
      if (user !== null) {
        setUserId(user);
      }
    };

    setIsFetching(false);
    fetchUserId();
  }, [isFecthing]);

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [data]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "https://chat-api-with-auth.up.railway.app/messages",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (res.status === 200) {
          const jsonData = await res.json();
          setData(jsonData.data);
          flatListRef.current.scrollToEnd({ animated: true });
        } else {
          console.log(`Error: Received status code ${res.status}`);
        }
      } catch (error) {
        console.log("Error fetching chat messages:", error);
      }
    };

    fetchData();
  }, [isFecthing]);

  const openModal = (messageId) => {
    setIsModalVisible(true);
    setSelectedMessageId(messageId);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedMessageId(null);
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(
        "https://chat-api-with-auth.up.railway.app/messages/" +
          selectedMessageId,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (res.ok) {
        closeModal();
        setIsFetching(true);
        setData((prevData) =>
          prevData.filter((item) => item._id !== selectedMessageId)
        );
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log("Failed to delete the message!");
    }
  };

  const renderItem = ({ item }) => {
    let isCurrentUser;
    if (item.user !== null) {
      if (item.user._id === userId) {
        isCurrentUser = true;
      } else {
        isCurrentUser = false;
      }
    }

    return (
      <TouchableOpacity
        style={[
          styles.listItem,
          isCurrentUser ? styles.myMessage : styles.otherMessage,
        ]}
        onLongPress={() => openModal(item._id)}
        delayLongPress={1000}
      >
        <View style={styles.messageContainer}>
          <Text style={styles.username}>
            {item?.user?.username ?? "placeholder"}
          </Text>
          <Text style={styles.message} numberOfLines={3}>
            {item?.content ?? "No content"}
          </Text>
        </View>
        <Text style={styles.timestamp}>
          {new Date(item?.date).toLocaleDateString() ?? "No date"}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Device.brand === "ios" ? "padding" : null}
      keyboardVerticalOffset={Device.brand === "ios" ? 90 : 0}
    >
      <View style={styles.container}>
        {data !== null && (
          <>
            <FlatList
              ref={flatListRef}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) =>
                item._id !== undefined
                  ? item._id.toString() + index
                  : Math.floor(Math.random() * 99999)
              }
              initialNumToRender={10}
              maintainVisibleContentPosition={{
                minIndexForVisible: 1,
                autoscrollToTopThreshold: 5,
              }}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.textInput}
                value={message}
                onChangeText={setMessage}
                placeholder="Type a message"
              />
              <TouchableOpacity onPress={handleSend}>
                <Ionicons name="send" size={24} color="blue" />
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
      <Modal animationType="slide" transparent={true} visible={isModalVisible}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <Text>Do you want to delete this message?</Text>
              <Button title="Delete" onPress={handleDelete} />
              <Button title="Cancel" onPress={closeModal} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    marginLeft: 10,
    marginRight: 10,
  },
  listItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "lightgray",
    width: "70%",
    marginBottom: 10,
    borderRadius: 8,
  },
  thumbnail: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  messageContainer: {
    flex: 1,
    marginLeft: 16,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#aaa",
    alignSelf: "center",
  },
  myMessage: {
    justifyContent: "flex-end",
    backgroundColor: "#e6e6e6",
  },
  otherMessage: {
    justifyContent: "flex-start",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginRight: 10,
  },
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    padding: 20,
    marginTop: 50,
    marginBottom: 50,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: "white",
    borderRadius: 15,
  },
});
