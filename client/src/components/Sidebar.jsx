import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import socket from "./socket";
import "../App.css";

const Sidebar = () => {
  const [data, setData] = useState([]);
  const [group, setGroup] = useState([]);
  const navigate = useNavigate();

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
    axios
      .get("http://localhost:5001/user/getroom")
      .then((res) => {
        console.log("room data", res.data);
        setGroup(res.data);
      })
      .catch((er) => {
        console.log(er);
      });
  }, []);

  const handleclick = (id) => {
    console.log(id);
    navigate(`user/${id}`);
  };

   return (
    <>

      <div className="sidebar-main">

        <div className="heading">
          <h1 style={{ color: "white" }}>Chat</h1>
        </div>
        <hr />
        
        {data.map((item, i) => {
          return (
            <div
              key={i}
              style={{ width: "100%", textAlign: "center", height: "50px",padding:'5px' }}
              onClick={() => handleclick(item.id)}
            >
              <li
                style={{
                  cursor: "pointer",
                  fontSize: "30px",
                  listStyle: "none",
                  color: "white",
                }}
              >
                {item.userName ==localStorage.getItem("name") ? item.userName+" " +'(you)':item.userName }{" "}
                <div
                  style={{
                    backgroundColor: item.status == "true" ? "green" : "red",
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    
                  }}
                ></div>
              </li>

              <hr />
            </div>
            
          );
        })}

       

       <div className="heading">
          <h1 style={{ color: "white" }}>Groups</h1>
        </div>
        <hr />

        {group.map((item, i) => {
          {
            if (item.roomMember.includes(localStorage.getItem("name"))) {
              return (
                <div
                  key={i}
                  style={{ width: "100%", textAlign: "center", height: "50px" }}
                  onClick={() =>
                    navigate(`gropuchat/${item.id}`, { state: item })
                  }
                >
                  <li
                    style={{
                      cursor: "pointer",
                      fontSize: "30px",
                      listStyle: "none",
                      color: "white",
                    }}
                  >
                    {item.roomName}
                  </li>
                  <hr />
                </div>
              );
            }
          }
        })}


     
      </div>

    </>
  );
};

export default Sidebar;
