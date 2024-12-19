import React from "react";
import "../css/Manage.css";
import Navbar from "./Navbar";
import SideBar from "./SideBar";
import { useState } from "react";
import PrintDocument from "./PrintDocument";
import HistoryStudentPrint from "./HistoryStudentPrint";
import TopUp from "./TopUp";
import CustomerSupport from "./CustomerSupport";

const Manage = () => {
  const [activeTab, setActiveTab] = useState("In tài liệu"); // Theo dõi tab nào được chọn

  const renderContent = () => {
    switch (activeTab) {
      case "In tài liệu":
        return <PrintDocument />;
      case "Lịch sử in":
        return <HistoryStudentPrint />;
      case "Mua thêm trang in":
        return <TopUp />;
      case "Hỗ trợ":
        return <CustomerSupport />;
      default:
        return null;
    }
  };

  return (
    <div className="manage-container">
      <SideBar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="manage-content">
        <Navbar collapsable />
        <div className="manage-main">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Manage;