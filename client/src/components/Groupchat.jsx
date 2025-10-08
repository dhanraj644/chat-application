import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import socket from "./socket";
import axios from "axios";
const Groupchat = () => {
  const { id } = useParams();
  const location = useLocation();
  const data = location.state || {};

  const [msg, setMsg] = useState("");
  const [display, setDisplay] = useState([]);

  useEffect(() => {
    socket.emit("join", data.roomid);
  }, [id]);
  
  useEffect(() => {

    axios
      .get("http://localhost:5001/chat/groupchat")
      .then((res) => {
        // console.log(res.data)
        setDisplay(res.data);
      })
      .catch((er) => {
        console.log(er);
      });

    socket.connect();

    socket.on("groupchat", (msg) => {
      console.log("rec", msg);
      setDisplay((display) => [...display, msg]);
    });
  }, []);

  const sendChat = () => {
    let messages = {};

    const time = Date().slice(0, 25);
    messages["name"] = localStorage.getItem("name");
    messages["msg"] = msg;
    messages["date"] = time;
    messages["groupid"] = id;

    socket.emit("groupchat", data.roomid, messages);
    setMsg("");
  };


  return (
    <div style={{ width: "100%", height: "91vh" }}>
      <span>
        <strong>group members :</strong> {data.roomMember.join("  ")}
      </span>
      <div className="display-main">
        <div id="msgdisplay">
          {display.map((i) => {
            return (
              <>
                {id == i.groupid ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        i.name === localStorage.getItem("name")
                          ? "end"
                          : "start",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "5px",
                        width: "350px",
                        border: "1px solid grey",
                          backgroundColor:'black'
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          color: "red",
                          textAlign: "start",
                          paddingRight: "5px",
                          padding: "2px",
                        }}
                      >
                        {i.name === localStorage.getItem("name")
                          ? "you"
                          : i.name}
                      </div>

                      <span style={{color: "white", fontSize:'30px'}}> {
                      i.msg
                       }</span>
                     {" "}
                      <div
                        style={{
                          fontSize: "12px",
                          color: "red",
                          textAlign: "end",
                          paddingRight: "5px",
                          padding: "2px",
                        }}
                      >
                        {i.date}
                      </div>
                    </div>{" "}
                  </div>
                ) : (
                  <></>
                )}
              </>
            );
          })}
        </div>
      </div>

      <div id="main">
        <input
          type="text"
          id="textValue"
          value={msg}
          onChange={(e) => {
            setMsg(e.target.value);
          }}
        />
        <button
          style={{ background: "black", borderRadius: "5px", color: "white" }}
          onClick={() => sendChat()}
        >
          Send
        </button>


      </div>
    </div>
  );
};

export default Groupchat;
