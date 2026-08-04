import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import socket from "../socket";
import { Mail, Lock, LogIn } from "lucide-react";
import api from "../api";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post(`${api}/user/login`, {
        email: email,
        password: password,
      })
      .then((res) => {
        console.log("Logged in user:", res.data.name);
        localStorage.setItem("name", res.data.name);
        localStorage.setItem("id", res.data.id);

        toast.success("Login successful!");
        setEmail("");
        setPassword("");
        
        socket.connect();
        socket.emit("connected", res.data.id);

        navigate("/index");
      })
      .catch((er) => {
        console.log("error", er);
        toast.error(er.response?.data?.msg || er.response?.data || "Something went wrong!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-title">Welcome Back</div>
        <div className="auth-subtitle">Sign in to continue to Chat Application</div>
        
        <form onSubmit={handlesubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="Email">Email Address</label>
            <div className="form-input-wrapper">
              <Mail className="form-input-icon" size={18} />
              <input
                id="Email"
                className="form-input"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <div className="form-input-wrapper">
              <Lock className="form-input-icon" size={18} />
              <input
                id="password"
                className="form-input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="form-button" disabled={loading}>
            <LogIn size={18} />
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="form-link">
            Don't have an account? <Link to="/singup">Signup now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
