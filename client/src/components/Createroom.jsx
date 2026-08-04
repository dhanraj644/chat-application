import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import { PlusCircle, Key, Users, BookOpen } from "lucide-react";
import api from "./api";
const Createroom = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [roomid, setRoomid] = useState("");
  const [roomname, setRoomName] = useState("");
  const [users, setUsers] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get(`${api}/user/getUser`)
      .then((res) => {
        setData(res.data);
      })
      .catch((er) => {
        console.error("Error fetching users:", er);
      });
  }, []);

  const handleChange = (e) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    setUsers((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);

    let member = [];
    for (let x in users) {
      if (users[x] === true) {
        member.push(x);
      }
    }

    // Automatically include the creator in the room members
    const currentUserName = localStorage.getItem("name");
    if (!member.includes(currentUserName)) {
      member.push(currentUserName);
    }

    const creatorId = localStorage.getItem("id");

    axios
      .post(`${api}/user/createroom`, {
        roomid: roomid,
        roomName: roomname,
        members: member,
        createdBy: creatorId,
      })
      .then((res) => {
        console.log("Room created successfully:", res.data);
        socket.emit("join", roomid);
        navigate("/index");
      })
      .catch((er) => {
        console.error("Error creating room:", er);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
      <div className="auth-card glass-panel animate-fade-in" style={{ maxWidth: "500px" }}>
        <div className="auth-title">Create Group Channel</div>
        <div className="auth-subtitle">Create a private space to talk with multiple friends</div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="roomId">Room Code / ID</label>
            <div className="form-input-wrapper">
              <Key className="form-input-icon" size={18} />
              <input
                id="roomId"
                className="form-input"
                type="text"
                placeholder="e.g. room-101"
                value={roomid}
                onChange={(e) => setRoomid(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="roomName">Group Name</label>
            <div className="form-input-wrapper">
              <BookOpen className="form-input-icon" size={18} />
              <input
                id="roomName"
                className="form-input"
                type="text"
                placeholder="e.g. Project Team"
                value={roomname}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <Users size={16} />
              <span>Select Members</span>
            </label>
            <div className="checkbox-list">
              {data.map((userItem, key) => {
                // Don't show current logged in user since they are auto-included
                if (userItem.userName === localStorage.getItem("name")) return null;
                return (
                  <label key={userItem.id || key} className="checkbox-item">
                    <input
                      type="checkbox"
                      name={userItem.userName}
                      onChange={handleChange}
                    />
                    <span>{userItem.userName}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            <PlusCircle size={18} />
            {loading ? "Creating Group..." : "Create Group"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Createroom;
