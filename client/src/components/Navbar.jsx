import axios from "axios";
import React from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, LogOut, Menu, X, User } from "lucide-react";
import api from "./api";
const Navbar = ({ toggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate();

  const logout = () => {
    const currentid = localStorage.getItem("id");
    axios
      .put(`${api}/user/statusUpdate/${currentid}`)
      .then((res) => {
        console.log(res);
        socket.emit("logout", currentid);
        localStorage.removeItem("id");
        localStorage.removeItem("name");
        localStorage.removeItem("token");
        navigate(`/`);
      })
      .catch((er) => {
        console.log(er);
      });
  };

  const handleclickroom = () => {
    navigate(`createroom`);
  };

  const username = localStorage.getItem("name");

  return (
    <div className="header-nav glass-panel">
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <button className="menu-toggle-btn" onClick={toggleSidebar}>
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div className="nav-brand">
          <MessageSquare size={24} />
          <span>ChatApp</span>
        </div>
      </div>

      <div className="nav-user">
        <div className="avatar">
          {username ? username.charAt(0).toUpperCase() : <User size={16} />}
        </div>
        <span style={{ fontWeight: "600", fontSize: "15px" }}>{username}</span>
      </div>

      <div className="nav-actions">
        <button
          onClick={handleclickroom}
          className="nav-btn primary"
        >
          <Plus size={16} />
          <span className="btn-text" style={{ display: "inline-flex" }}>Create Group</span>
        </button>
        <button
          onClick={logout}
          className="nav-btn secondary"
        >
          <LogOut size={16} />
          <span className="btn-text" style={{ display: "inline-flex" }}>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
