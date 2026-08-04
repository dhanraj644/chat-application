import api from "./api";
import React, { useEffect, useState, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import socket from "./socket";
import axios from "axios";
import { Send, Users } from "lucide-react";

const Groupchat = () => {
  const { id } = useParams();
  const location = useLocation();
  const [roomDetails, setRoomDetails] = useState(location.state || null);
  const [msg, setMsg] = useState("");
  const [display, setDisplay] = useState([]);
  const [typingUsers, setTypingUsers] = useState({}); // maps username -> boolean
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const currentUserName = localStorage.getItem("name");

  // Fetch room details if page is refreshed or loaded directly without router state
  useEffect(() => {
    if (!location.state || id !== location.state.id) {
      axios
        .get(`${api}/user/getroom`)
        .then((res) => {
          const found = res.data.find((r) => r.id === id);
          setRoomDetails(found);
        })
        .catch((err) => {
          console.error("Error fetching room details:", err);
        });
    } else {
      setRoomDetails(location.state);
    }
    // Clear typing states when group changes
    setTypingUsers({});
  }, [id, location.state]);

  // Join the socket room once room details are loaded
  useEffect(() => {
    if (roomDetails && roomDetails.roomid) {
      console.log("Emitting join for room code:", roomDetails.roomid);
      socket.emit("join", roomDetails.roomid);
    }
  }, [roomDetails]);

  // Fetch message log and bind socket listeners
  useEffect(() => {
    axios
      .get(`${api}/chat/groupchat`)
      .then((res) => {
        setDisplay(res.data);
      })
      .catch((er) => {
        console.error("Error fetching group chat history:", er);
      });

    socket.connect();

    const handleGroupChatReceived = (incomingMsg) => {
      console.log("Received group message in component:", incomingMsg);
      setDisplay((prev) => [...prev, incomingMsg]);
    };

    const handleTypingEvent = (data) => {
      // Check if typing event belongs to this group room and not from myself
      if (roomDetails && data.roomid === roomDetails.roomid && data.name !== currentUserName) {
        setTypingUsers((prev) => ({
          ...prev,
          [data.name]: data.isTyping,
        }));
      }
    };

    socket.on("groupchat", handleGroupChatReceived);
    socket.on("typing", handleTypingEvent);

    return () => {
      socket.off("groupchat", handleGroupChatReceived);
      socket.off("typing", handleTypingEvent);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [id, roomDetails, currentUserName]);

  // Auto-scroll to the bottom of the messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [display]);

  const handleInputChange = (e) => {
    setMsg(e.target.value);
    if (!roomDetails) return;

    // Emit group typing start
    socket.emit("typing", {
      roomid: roomDetails.roomid,
      name: currentUserName,
      isTyping: true,
    });

    // Debounce group typing stop
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        roomid: roomDetails.roomid,
        name: currentUserName,
        isTyping: false,
      });
    }, 1500);
  };

  const sendChat = (e) => {
    if (e) e.preventDefault();
    if (!msg.trim() || !roomDetails) return;

    // Clear typing timeout and emit typing stop immediately on submit
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    socket.emit("typing", {
      roomid: roomDetails.roomid,
      name: currentUserName,
      isTyping: false,
    });

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    let messages = {
      name: currentUserName,
      msg: msg,
      date: time,
      groupid: id,
    };

    socket.emit("groupchat", roomDetails.roomid, messages);
    setMsg("");
  };

  const filteredMessages = display.filter((item) => id === item.groupid);

  // Filter keys of typingUsers that are active (true)
  const activeTypists = Object.keys(typingUsers).filter((name) => typingUsers[name]);

  return (
    <div className="chat-container">
      {/* Header bar */}
      <div className="chat-header">
        <div className="chat-header-info">
          <div className="avatar" style={{ color: "var(--accent-hover)" }}>
            {roomDetails?.roomName ? roomDetails.roomName.charAt(0).toUpperCase() : "#"}
          </div>
          <div>
            <div className="chat-header-title">{roomDetails ? roomDetails.roomName : "Loading Group..."}</div>
            
            {activeTypists.length > 0 ? (
              <div className="typing-indicator-chat" style={{ marginTop: "2px" }}>
                <span>{activeTypists.join(", ")} {activeTypists.length === 1 ? "is" : "are"} typing</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : (
              <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>
                Room ID: {roomDetails?.roomid}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Members indicator bar */}
      <div className="group-members-bar">
        <Users size={14} />
        <span>Group Members: </span>
        <span className="group-members-list">
          {roomDetails?.roomMember ? roomDetails.roomMember.join(", ") : ""}
        </span>
      </div>

      {/* Message history */}
      <div className="chat-messages">
        {filteredMessages.map((item, index) => {
          const isSentByMe = item.name === currentUserName;
          return (
            <div
              key={item.id || index}
              className={`message-wrapper ${isSentByMe ? "sent" : "received"}`}
            >
              <div className="message-bubble">
                {!isSentByMe && <span className="message-sender">{item.name}</span>}
                <span className="message-content">{item.msg}</span>
                <span className="message-time">{item.date}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <form onSubmit={sendChat} className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="Send message to group..."
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

export default Groupchat;
