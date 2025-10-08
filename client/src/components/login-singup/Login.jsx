import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import socket from "../socket";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5001/user/login", {
      
        email: email,
        password: password,
      })
      .then((res) => {
        console.log(res.data.name);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("id", res.data.id);

        toast.success("user is login");
        setEmail("");
        setPassword("");
        socket.connect();

        socket.emit("connected", res.data.id);

        navigate("/index");
      })
      .catch((er) => {
        console.log("error", er);
      });
  };

  return (
    <>
      <div className="main">
        <div className="box">
          <form onSubmit={handlesubmit}>
            <div className="heading">
              <h1>Login Form</h1>
            </div>
            <div className="group">
              <label for="Email">Email </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="group">
              <label for="password">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div style={{ textAlign: "center" }}>
              <button type="submit" className="submit">
                LOGIN
              </button>
            </div>

            <h4 className="link">
              <Link to="/singup">Singup now</Link>
            </h4>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
