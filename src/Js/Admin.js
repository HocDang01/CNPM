import React, { useState } from "react";
import "../css/SPSO.css";
import Navbar from "./Navbar";
import SideBarAdmin from "./SideBarAdmin";
import SPSOAccount from "./SPSOAccount";
import StudentAccount from "./StudentAccount";
import ListPrinter from "./ListPrinter";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("Trang chủ"); // Theo dõi tab nào được chọn

  const renderContent = () => {
    switch (activeTab) {
      case "Trang chủ":
        return <h2>Đây là Trang chủ</h2>;
      case "Tài khoản SPSO":
        return <SPSOAccount/>;
      case "Tài khoản sinh viên":
        return <StudentAccount/>;
      case "Xem dữ liệu":
        return <ListPrinter/>;
      default:
        return null;
    }
  };

  return (
    <div className="SPSO-container">
      <SideBarAdmin activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="SPSO-content">
        <Navbar />
        <div className="SPSO-main">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Admin;
