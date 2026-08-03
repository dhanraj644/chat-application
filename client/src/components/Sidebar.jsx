import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "./socket";
import { Users, Hash, User, Search } from "lucide-react";
import "../App.css";

const Sidebar = ({ isOpen, closeSidebar }) => {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState([]);
  const [activeTab, setActiveTab] = useState("users"); // "users" or "groups"
  const [searchQuery, setSearchQuery] = useState("");
  const [privateMsgs, setPrivateMsgs] = useState([]);
  const [groupMsgs, setGroupMsgs] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const currentUserId = localStorage.getItem("id");
  const currentUserName = localStorage.getItem("name");

  useEffect(() => {
    // Fetch users
    axios
      .get("http://localhost:5000/user/getUser")
      .then((res) => {
        setData(res.data);
      })
      .catch((er) => {
        console.error("Error fetching users:", er);
      });

    // Fetch rooms
    axios
      .get("http://localhost:5000/user/getroom")
      .then((res) => {
        setGroup(res.data);
      })
      .catch((er) => {
        console.error("Error fetching rooms:", er);
      });

    // Fetch all chat logs for sidebar previews
    axios
      .get("http://localhost:5000/chat/get")
      .then((res) => {
        setPrivateMsgs(res.data);
      })
      .catch((er) => {
        console.error("Error fetching chats for sidebar:", er);
      });

    axios
      .get("http://localhost:5000/chat/groupchat")
      .then((res) => {
        setGroupMsgs(res.data);
      })
      .catch((er) => {
        console.error("Error fetching group chats for sidebar:", er);
      });

    // Setup socket connection and event listeners
    socket.connect();
    
    const handleStatusChange = ({ id, status }) => {
      console.log("Status change in sidebar:", id, status);
      setData((prevData) =>
        prevData.map((u) => (u.id === id ? { ...u, status } : u))
      );
    };

    const handlePrivateMessage = (msg) => {
      setPrivateMsgs((prev) => [...prev, msg]);
    };

    const handleGroupChat = (msg) => {
      setGroupMsgs((prev) => [...prev, msg]);
    };

    socket.on("statusChange", handleStatusChange);
    socket.on("private message", handlePrivateMessage);
    socket.on("groupchat", handleGroupChat);

    return () => {
      socket.off("statusChange", handleStatusChange);
      socket.off("private message", handlePrivateMessage);
      socket.off("groupchat", handleGroupChat);
    };
  }, []);

  const handleUserClick = (id) => {
    navigate(`user/${id}`);
    closeSidebar();
  };

  const handleGroupClick = (item) => {
    navigate(`groupchat/${item.id}`, { state: item });
    closeSidebar();
  };

  const getLastPrivateMsg = (targetUserId) => {
    const chats = privateMsgs.filter(
      (m) =>
        (m.from === currentUserId && m.to === targetUserId) ||
        (m.from === targetUserId && m.to === currentUserId)
    );
    return chats.length > 0 ? chats[chats.length - 1] : null;
  };

  const getLastGroupMsg = (groupId) => {
    const chats = groupMsgs.filter((m) => m.groupid === groupId);
    return chats.length > 0 ? chats[chats.length - 1] : null;
  };

  // Filter listings based on search query
  const filteredUsers = data.filter((item) =>
    item.userName && item.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = group
    .filter((item) => item.roomMember && item.roomMember.includes(currentUserName))
    .filter((item) =>
      item.roomName && item.roomName.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className={`sidebar ${isOpen ? "active" : ""}`}>
      {/* Search Input */}
      <div className="sidebar-search-wrapper">
        <Search className="sidebar-search-icon" size={16} />
        <input
          type="text"
          className="sidebar-search-input"
          placeholder="Search direct messages or groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="sidebar-nav-tabs" style={{ borderTop: "none" }}>
        <button
          className={`sidebar-tab ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={16} />
          <span>Direct Messages</span>
        </button>
        <button
          className={`sidebar-tab ${activeTab === "groups" ? "active" : ""}`}
          onClick={() => setActiveTab("groups")}
        >
          <Hash size={16} />
          <span>Group Channels</span>
        </button>
      </div>

      <div className="sidebar-list">
        {activeTab === "users" ? (
          filteredUsers.map((item, i) => {
            const isSelf = item.userName === currentUserName;
            const isActive = location.pathname.includes(`user/${item.id}`);
            const lastMsg = getLastPrivateMsg(item.id);

            return (
              <div
                key={item.id || i}
                className={`list-item ${isActive ? "active" : ""}`}
                onClick={() => handleUserClick(item.id)}
              >
                <div className="avatar">
                  {item.userName ? item.userName.charAt(0).toUpperCase() : <User size={16} />}
                </div>
                <div className="item-details">
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="item-name" style={{ fontWeight: "600" }}>
                      {item.userName} {isSelf && "(You)"}
                    </span>
                    <div className="item-status-wrapper">
                      <div className={`status-dot ${item.status === "true" ? "online" : "offline"}`} />
                    </div>
                  </div>
                  {lastMsg ? (
                    <div className="item-last-msg">
                      {lastMsg.from === currentUserId ? "You: " : ""}{lastMsg.content}
                    </div>
                  ) : (
                    <div className="item-last-msg" style={{ fontStyle: "italic", opacity: 0.5 }}>
                      No messages yet
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          filteredGroups.map((item, i) => {
            const isActive = location.pathname.includes(`groupchat/${item.id}`);
            const lastMsg = getLastGroupMsg(item.id);

            return (
              <div
                key={item.id || i}
                className={`list-item ${isActive ? "active" : ""}`}
                onClick={() => handleGroupClick(item)}
              >
                <div className="avatar" style={{ color: "var(--accent-hover)" }}>
                  {item.roomName ? item.roomName.charAt(0).toUpperCase() : "#"}
                </div>
                <div className="item-details">
                  <div className="item-name" style={{ fontWeight: "600" }}>{item.roomName}</div>
                  {lastMsg ? (
                    <div className="item-last-msg">
                      <strong>{lastMsg.name}:</strong> {lastMsg.msg}
                    </div>
                  ) : (
                    <div className="item-last-msg" style={{ fontStyle: "italic", opacity: 0.5 }}>
                      No messages yet
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Sidebar;
