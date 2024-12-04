import React from 'react';
import '../css/LoginPage.css'; // Import file CSS

const LoginPage = () => {
  const handleLogin = () => {
    // Chuyển hướng đến backend để thực hiện đăng nhập Google
    window.location.href = 'http://localhost:5000/account/login';
  };

  return (
    <div className="login-container">
      <h2>Đăng nhập</h2>
      <button className="login-button" onClick={handleLogin}>Đăng nhập bằng tài khoản Google</button>
      <p>Chưa có tài khoản? Đăng ký ngay để trải nghiệm.</p>
    </div>
  );
};

export default LoginPage;
