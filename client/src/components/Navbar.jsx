import axios from "axios";
import React from "react";
import socket from "./socket";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = () => {
    const currentid = localStorage.getItem("id");
    axios
      .put(`http://localhost:5001/user/statusUpdate/${currentid}`)
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
  return (
    <div
      style={{
        width: "100%",
        height: "80px",
        backgroundColor: "black",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        borderBottom:'1px solid crimson'
      }}
    >
      <div
        className="heading"
        style={{ textAlign: "left", paddingLeft: "20px" }}
      >
        <h1 style={{ color: "crimson" }}>{localStorage.getItem("name")}</h1>
      </div>

      <div
        className="heading"
        style={{ textAlign: "left", paddingLeft: "20px" }}
      >
        <h1 style={{ color: "crimson" }}>Chat Application</h1>
      </div>

      <div style={{ display: "flex",gap:'5px' }}>
        <div style={{ textAlign: "center" }}>
          <button
            onClick={() => handleclickroom()}
            type="submit"
            className="submit"
            style={{ backgroundColor: "crimson", color: "white", borderRadius:'10px'}}
          >
            Create Group
          </button>
        </div>
        <div style={{ textAlign: "center", paddingRight: "20px" }}>
          <button
            onClick={() => logout()}
            type="submit"
            className="submit"
            style={{ backgroundColor: "crimson", color: "white",borderRadius:'10px' }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
