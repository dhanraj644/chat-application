import React from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Index = () => {
  return (
    <>
      <Navbar/>
      <div style={{ display: "flex", gap: "5px" }}>
        <Sidebar />

        <Outlet />
      </div>
    </>
  );
};

export default Index;
