import React from "react";
import { FaUserCircle, FaBell } from "react-icons/fa";
import '../css/Navbar.css'
import menu from '../images/menu.jpg'

const Navbar = () => {
    return (
      <div className="navbar">
        <div className="navbar-logo">
          <img className="navbar-logo-circle" src={menu}></img>
        </div>
        <div className="navbar-notification">
          <FaBell size={24} />
          <span className="navbar-notification-badge">2</span>
        </div>
        <div className="navbar-user">
          <FaUserCircle size={32} />
          <div className="navbar-user-info">
            <span className="navbar-user-name">Moni Roy</span>
            <span className="navbar-user-balance">Số dư: 50 trang</span>
          </div>
        </div>
      </div>
    );
  };

  export default Navbar;
