import React, { useState } from "react";
import "../css/SPSO.css";
import Navbar from "./Navbar";
import SideBarSPSO from "./SideBarSPSO";
import ViewReport from "./ViewReport";
import HistoryAllPrint from "./HistoryAllPrint";
import ListPrinter from "./ListPrinter";
import Configure from "./Configure";

const SPSO = () => {
  const [activeTab, setActiveTab] = useState("Trang chủ"); // Theo dõi tab nào được chọn

  const renderContent = () => {
    switch (activeTab) {
      case "Trang chủ":
        return <h2>Đây là Trang chủ</h2>;
      case "Xem báo cáo":
        return <ViewReport/>;
      case "Xem lịch sử in":
        return <HistoryAllPrint/>;
      case "Danh sách máy in":
        return <ListPrinter/>;
      case "Cấu hình":
        return <Configure/>;
      default:
        return null;
    }
  };

  return (
    <div className="SPSO-container">
      <SideBarSPSO activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="SPSO-content">
        <Navbar />
        <div className="SPSO-main">{renderContent()}</div>
      </div>
    </div>
  );
};

export default SPSO;
