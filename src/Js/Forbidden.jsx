import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Forbidden.css';  // Thêm CSS để tạo kiểu cho trang

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate(-1);  // Quay lại trang chủ
  };

  return (
    <div className="forbidden-container">
      <div className="forbidden-content">
        <h1>403 - Bạn không có quyền truy cập</h1>
        <p>Xin lỗi, bạn không có quyền truy cập vào trang này.</p>
        <button className="go-home-btn" onClick={handleGoHome}>Quay về</button>
      </div>
    </div>
  );
};

export default Forbidden;
