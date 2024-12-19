import React from "react";
import "../css/Sidebar.css";
import hcmut from "../images/HCMUT_official_logo.png";

const SideBar = ({ activeTab, onTabChange }) => {
  const handleLogout = () => {
    // Xóa thông tin trong localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('role');
    window.location.href = '/login'; // Chuyển hướng về trang đăng nhập
  };
  return (
    <div id="sidebarSPSO">
      <div className="sidebar-logo">
        <img className="sidebar-logo-circle" src={hcmut} alt="HCMUT Logo" />
      </div>
      <nav className="sidebar-menu">
        {["In tài liệu", "Lịch sử in", "Mua thêm trang in", "Hỗ trợ"].map(
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
        
        {/* Thêm mục Đăng xuất */}
        <a
          className="sidebar-item logout"
          onClick={handleLogout}
        >
          Đăng xuất
        </a>
      </nav>
    </div>
  );
};

export default SideBar;