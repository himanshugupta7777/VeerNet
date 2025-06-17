import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { ref, onValue, push, set, remove } from "firebase/database";
import "./chatroom.css";
import { useNavigate } from "react-router-dom";

const ChatRoom = () => {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [joinTime, setJoinTime] = useState(null);
  const [typingUsers, setTypingUsers] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const navigate = useNavigate();

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.name) {
      alert("Please login to access the chatroom.");
      navigate("/login");
    } else {
      setUsername(storedUser.name);
    }
  }, [navigate]);

  // Load messages
  useEffect(() => {
    const messagesRef = ref(db, "messages");
    return onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const allMsgs = Object.entries(data).map(([id, msg]) => ({
          id,
          ...msg,
        }));
        setMessages(allMsgs);
      } else {
        setMessages([]);
      }
    });
  }, []);

  // Typing users
  useEffect(() => {
    const typingRef = ref(db, "typingStatus");
    return onValue(typingRef, (snapshot) => {
      const data = snapshot.val() || {};
      const active = Object.entries(data)
        .filter(([name, isTyping]) => isTyping && name !== username)
        .map(([name]) => name);
      setTypingUsers(active);
    });
  }, [username]);

  // Online users
  useEffect(() => {
    const presenceRef = ref(db, "presence");
    return onValue(presenceRef, (snapshot) => {
      const data = snapshot.val() || {};
      setOnlineUsers(Object.keys(data));
    });
  }, []);

  // Join chatroom
  useEffect(() => {
    if (!username) return;

    const presenceRef = ref(db, `presence/${username}`);
    set(presenceRef, true);

    const messagesRef = ref(db, "messages");
    push(messagesRef, {
      name: "System",
      text: `${username} joined the chat`,
      timestamp: Date.now(),
    });

    setJoinTime(Date.now());

    const handleUnload = () => {
      remove(presenceRef);
      set(ref(db, `typingStatus/${username}`), false);
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener("beforeunload", handleUnload);
    };
  }, [username]);

  const setTypingStatus = (isTyping) => {
    const typingRef = ref(db, `typingStatus/${username}`);
    set(typingRef, isTyping);
  };

  const sendMessage = () => {
    if (message.trim() === "") return;

    const messagesRef = ref(db, "messages");
    push(messagesRef, {
      name: username,
      text: message,
      timestamp: Date.now(),
    });

    setTypingStatus(false);
    setMessage("");
  };

  return (
    <div className="chat-container">
      <h2 className="chat-header">Welcome, {username}</h2>

      {onlineUsers.length > 0 && (
        <div className="online-users">🟢 Online: {onlineUsers.join(", ")}</div>
      )}

      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(", ")} {typingUsers.length > 1 ? "are" : "is"} typing...
        </div>
      )}

      <div className="message-box">
        {messages
          .filter((msg) => msg.timestamp >= joinTime)
          .sort((a, b) => a.timestamp - b.timestamp)
          .map((msg) => (
            <div
              key={msg.id}
              className={`message ${msg.name === "System" ? "system" : ""}`}
            >
              <div className="meta">
                {msg.name} | {new Date(msg.timestamp).toLocaleTimeString()}
              </div>
              <div className="text">{msg.text}</div>
            </div>
          ))}
      </div>

      <div className="input-section">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setTypingStatus(true);
            clearTimeout(window.typingTimeout);
            window.typingTimeout = setTimeout(() => {
              setTypingStatus(false);
            }, 2000);
          }}
          placeholder="Type your message"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatRoom;
