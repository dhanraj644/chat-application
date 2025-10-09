import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import socket from "../socket";
import axios from "axios";

const Chatbox = () => {
  const { id } = useParams();
  const [msg, setMsg] = useState("");
  const [privatemsg, setPrivatemsg] = useState([]);

  useEffect(() => {

    axios
      .get("https://chat-application-l275.onrender.com/chat/get")
      .then((res) => {
        console.log(res.data);
          setPrivatemsg(res.data);

          })
      .catch((er) => {
        console.log(er);
      });
  
    socket.connect();
    socket.emit("connected", localStorage.getItem("id"));

    socket.on("private message", (data) => {
      console.log("Received private message:", data);
      setPrivatemsg((privatemsg) => [...privatemsg, data]);
    });
  }, []);

  const handliBtnprivate = () => {
    console.log(socket);
    console.log(socket.id);
    // sockets.connect()
    const time = Date().slice(0, 25);
    let detail = {};

    detail["to"] = id;
    detail["content"] = msg;
    detail["from"] = localStorage.getItem("id");
    detail["name"] = localStorage.getItem("name");
    detail["date"] = time;

    socket.emit("private message", detail);
       setMsg("");
  };

  return (
    <div style={{ width: "100%", height: "91vh" }}>
      <div className="display-main">
        <div id="msgdisplay">
          {privatemsg.map((item) => {
            return (
              <>
                {(id == item.to && localStorage.getItem("id") == item.from) ||
                (id == item.from && localStorage.getItem("id") == item.to) ? (
                  <div
                    style={{
                      justifyContent:
                        item.name == localStorage.getItem("name")
                          ? "end"
                          : "start",
                          Width: "100%",
                          display: "flex",
                    }}
                  >
                    <div
                      style={{
                        borderRadius: "5px",
                        width: "350px",
                        border: "1px solid grey",
                        backgroundColor:'black',
                        marginTop:'10px'
                      }}
                    >
                      <div
                        style={{
                          fontSize: "15px",
                          color: "red",
                          textAlign: "start",
                          paddingRight: "5px",
                          padding: "5px",
                        }}
                      >
                       <span>{item.name}</span> 
                      </div>
                      
                      <span style={{color: "white", fontSize:'30px'}}>{item.content}</span>

                      <div
                        style={{
                          fontSize: "12px",
                          color: "red",
                          textAlign: "end",
                          paddingRight: "5px",
                          padding: "5px",
                        }}
                      >
                        {item.date}
                      </div>
                    </div>
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
            console.log(e.target.value)
            setMsg(e.target.value);
          }}
        />
        <button
          onClick={handliBtnprivate}
          style={{ background: "black", borderRadius: "5px", color: "white" }}
        >
          send msg
        </button>
      
      </div>
    </div>
  );
};

export default Chatbox;
