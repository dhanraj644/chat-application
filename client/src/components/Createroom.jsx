import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "./socket";

const Createroom = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [roomid, setRoomid] = useState("");
  const [roomname, setRoomName] = useState("");
  const [users, setUsers] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5001/user/getUser")
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      })
      .catch((er) => {
        console.log(er);
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

    let member = [];
    for (let x in users) {
      if (users[x] == true) {
        member.push(x);
      }
    }

    const id = localStorage.getItem("id");
    axios
      .post("http://localhost:5001/user/createroom", {
        roomid: roomid,
        roomName: roomname,
        members: member,
        createdBy: id,
      })
      .then((res) => {
        console.log(res);

        socket.emit("join", roomid);
        console.log("group is created");
      })
      .catch((er) => {
        console.log(er);
      });

    navigate("/index");
  };
  return (
    <>
      <div className="main" style={{backgroundColor:'white',height:'91vh'}}>
        <div className="box">
          <form onSubmit={handleSubmit}>
            <div className="heading">
              <h1>Create Group</h1>
            </div>
            <div className="group">
              <label for="id">Room id </label>
              <input
                type="text"
                value={roomid}
                required
                onChange={(e) => setRoomid(e.target.value)}
              />
            </div>
            <div className="group">
              <label for="Email">Room Name </label>
              <input
                type="text"
                value={roomname}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label for="password">add users</label>
              {data.map((i, key) => {
                return (
                  <li
                    key={key}
                    style={{
                      listStyle: "none",
                      width: "100%",
                      display: "flex",
                    }}
                  >
                    <input
                      type="checkbox"
                      name={i.userName}
                      onChange={handleChange}
                    />
                    <h3>
                      : <strong>{i.userName}</strong>{" "}
                    </h3>
                  </li>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <button type="submit" className="submit">
                create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Createroom;
