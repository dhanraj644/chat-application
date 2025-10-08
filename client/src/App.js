import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login-singup/Login";
import Singup from "./components/login-singup/Singup";
import { ToastContainer } from "react-toastify";
import Index from "./components/Index";
import Chatbox from "./components/login-singup/Chatbox";
import Createroom from "./components/Createroom";
import Groupchat from "./components/Groupchat";
import Navbar from "./components/Navbar";
import Greeting from "./components/Greeting";

function App() {
  return (
    <>
      <Router>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/singup" element={<Singup />} />
          <Route path="/index" element={<Index />}>
            <Route index element={<Greeting />} />
            <Route path="user/:id" element={<Chatbox />} />
            <Route path="createroom" element={<Createroom />} />
            <Route path="gropuchat/:id" element={<Groupchat />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
