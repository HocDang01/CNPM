import React from "react";
import "../css/Sidebar.css";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-circle">BK</div>
      </div>
      <nav className="sidebar-menu">
        <a href="#" className="sidebar-item">Trang chủ</a>
        <a href="#" className="sidebar-item">In tài liệu</a>
        <a href="#" className="sidebar-item">Lịch sử in</a>
        <a href="#" className="sidebar-item">Mua thêm trang in</a>
        <a href="#" className="sidebar-item">Hỗ trợ</a>
      </nav>
    </div>
  );
};

export default Sidebar;
