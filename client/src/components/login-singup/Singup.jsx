import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { User, Mail, Lock, UserPlus } from "lucide-react";

const Singup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlesubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("http://localhost:5000/user/create", {
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        toast.success("Account created successfully!");
        navigate("/");
      })
      .catch((er) => {
        console.log("error", er);
        toast.error(er.response?.data?.msg || er.response?.data || "Signup failed!");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="auth-page">
      <div className="auth-card glass-panel">
        <div className="auth-title">Create Account</div>
        <div className="auth-subtitle">Join us to start chatting with your friends</div>
        
        <form onSubmit={handlesubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <div className="form-input-wrapper">
              <User className="form-input-icon" size={18} />
              <input
                id="name"
                className="form-input"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>

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
            <UserPlus size={18} />
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="form-link">
            Already have an account? <Link to="/">Login now</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Singup;
