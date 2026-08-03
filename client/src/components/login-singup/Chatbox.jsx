import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";
import { Send, User } from "lucide-react";

const Chatbox = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [privatemsg, setPrivatemsg] = useState([]);
  const [recipient, setRecipient] = useState(null);
  const [isRecipientTyping, setIsRecipientTyping] = useState(false);
  const [typingUserName, setTypingUserName] = useState("");
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  const currentUserId = localStorage.getItem("id");
  const currentUserName = localStorage.getItem("name");

  // Fetch recipient details whenever id changes
  useEffect(() => {
    axios
      .get("http://localhost:5000/user/getUser")
      .then((res) => {
        const found = res.data.find((u) => u.id === id);
        setRecipient(found);
      })
      .catch((err) => {
        console.error("Error fetching user details:", err);
      });
      
    // Clear typing states when switching users
    setIsRecipientTyping(false);
    setTypingUserName("");
  }, [id]);

  // Fetch chat history and set up socket listeners
  useEffect(() => {
    axios
      .get("http://localhost:5000/chat/get")
      .then((res) => {
        setPrivatemsg(res.data);
      })
      .catch((er) => {
        console.error("Error fetching private chats:", er);
      });

    socket.connect();
    socket.emit("connected", currentUserId);

    const handlePrivateMessage = (data) => {
      console.log("Received private message in chatbox:", data);
      setPrivatemsg((prev) => [...prev, data]);
    };

    const handleStatusChange = ({ id: userId, status }) => {
      setRecipient((prev) => {
        if (prev && prev.id === userId) {
          return { ...prev, status };
        }
        return prev;
      });
    };

    const handleTypingEvent = (data) => {
      // Check if typing event is from this recipient for this user
      if (data.from === id && data.to === currentUserId) {
        setIsRecipientTyping(data.isTyping);
        setTypingUserName(data.name);
      }
    };

    socket.on("private message", handlePrivateMessage);
    socket.on("statusChange", handleStatusChange);
    socket.on("typing", handleTypingEvent);

    return () => {
      socket.off("private message", handlePrivateMessage);
      socket.off("statusChange", handleStatusChange);
      socket.off("typing", handleTypingEvent);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, currentUserId]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [privatemsg]);

  const handleInputChange = (e) => {
    setMsg(e.target.value);

    // Emit typing start
    socket.emit("typing", {
      from: currentUserId,
      to: id,
      name: currentUserName,
      isTyping: true,
    });

    // Debounce typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        from: currentUserId,
        to: id,
        name: currentUserName,
        isTyping: false,
      });
    }, 1500);
  };

  const handliBtnprivate = (e) => {
    if (e) e.preventDefault();
    if (!msg.trim()) return;

    // Clear typing timeout and emit typing stop immediately on submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", {
      from: currentUserId,
      to: id,
      name: currentUserName,
      isTyping: false,
    });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let detail = {
      to: id,
      content: msg,
      from: currentUserId,
      name: currentUserName,
      date: time,
    };

    socket.emit("private message", detail);
    setMsg("");
  };

  const filteredMessages = privatemsg.filter(
    (item) =>
      (id === item.to && currentUserId === item.from) ||
      (id === item.from && currentUserId === item.to)
  );

  return (
    <div className="chat-container">
      {/* Header details */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="avatar">
            {recipient && recipient.userName ? recipient.userName.charAt(0).toUpperCase() : <User size={18} />}
          </div>
          <div>
            <div className="chat-header-title">{recipient ? recipient.userName : "Loading..."}</div>
            
            {isRecipientTyping ? (
              <div className="typing-indicator-chat" style={{ marginTop: "2px" }}>
                <span>typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }}>
                <div className={`status-dot ${recipient?.status === "true" ? "online" : "offline"}`} style={{ width: "6px", height: "6px" }} />
                <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                  {recipient?.status === "true" ? "Online" : "Offline"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message history */}
      <div className="chat-messages">
        {filteredMessages.map((item, index) => {
          const isSentByMe = item.from === currentUserId;
          return (
            <div
              key={item.id || index}
              className={`message-wrapper ${isSentByMe ? "sent" : "received"}`}
            >
              <div className="message-bubble">
                {!isSentByMe && <span className="message-sender">{item.name}</span>}
                <span className="message-content">{item.content}</span>
                <span className="message-time">{item.date}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <form onSubmit={handliBtnprivate} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Type a message..."
          value={msg}
          onChange={handleInputChange}
        />
        <button type="submit" className="chat-send-btn">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chatbox;
