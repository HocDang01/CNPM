import React from "react";
import "../css/SideBarSPSO.css";
import hcmut from "../images/HCMUT_official_logo.png";

const SideBarAdmin = ({ activeTab, onTabChange }) => {
  return (
    <div id="sidebarSPSO">
      <div className="sidebar-logo">
        <img className="sidebar-logo-circle" src={hcmut} alt="HCMUT Logo" />
      </div>
      <nav className="sidebar-menu">
        {["Trang chủ", "Tài khoản SPSO", "Tài khoản sinh viên", "Xem dữ liệu"].map(
          (item) => (
            <a
              key={item}
              className={`sidebar-item ${activeTab === item ? "active" : ""}`}
              onClick={() => onTabChange(item)} // Gọi hàm khi tab được chọn
            >
              {item}
            </a>
          )
        )}
      </nav>
    </div>
  );
};

export default SideBarAdmin;
