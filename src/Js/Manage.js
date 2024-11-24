import React from "react";
import "../css/Manage.css";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Manage = () => {
  return (
    <div className="manage-container">
      <Sidebar />
      <div className="manage-content">
        <Navbar />
        <div className="manage-main">
          <h2>Trang nội dung</h2>
        </div>
      </div>
    </div>
  );
};

export default Manage;
