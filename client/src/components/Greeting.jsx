import { MessageSquare } from "lucide-react";

const Greeting = () => {
  const currentUserName = localStorage.getItem("name") || "User";

  return (
    <div className="welcome-screen animate-fade-in">
      <div className="welcome-icon-box">
        <MessageSquare size={36} />
      </div>
      <h1 className="welcome-title">Welcome, {currentUserName}!</h1>
      <p className="welcome-subtitle">
        Select a conversation from direct messages or join a group channel in the sidebar to start chatting.
      </p>
    </div>
  );
};

export default Greeting;