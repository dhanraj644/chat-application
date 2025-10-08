import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const Singup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handlesubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:5001/user/create", {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success("user is created");
        navigate("/");
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
              <h1>Singup Form</h1>
            </div>
            <div className="group">
              <label for="name">Name </label>
              <input
                type="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
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
                create user
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Singup;
