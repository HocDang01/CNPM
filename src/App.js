import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Manage from './Js/Manage';
import SPSO from './Js/SPSO';
import Admin from './Js/Admin';
import LoginPage from './Js/LoginPage';
import PrivateRoute from './Js/PrivateRoute';
import Forbidden from './Js/Forbidden';

function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userRole = localStorage.getItem('role');
    
    // Kiểm tra xem đã có access token và role trong localStorage chưa
    if (!accessToken || !userRole) {
      // Nếu không có, lấy thông tin từ URL
      const urlParams = new URLSearchParams(window.location.search);
      const tokenFromUrl = urlParams.get('access_token');
      const roleFromUrl = urlParams.get('role');

      console.log("Access Token từ URL:", tokenFromUrl);
      console.log("User Role từ URL:", roleFromUrl);

      if (tokenFromUrl && roleFromUrl) {
        // Lưu vào localStorage
        localStorage.setItem('access_token', tokenFromUrl);
        localStorage.setItem('role', roleFromUrl);

        // Chuyển hướng sau khi lưu
        window.location.href = `/${roleFromUrl}page`;  // Chuyển hướng tới trang tương ứng
      }
    }
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Các route riêng tư */}
        <Route
          path="/spsopage"
          element={
            <PrivateRoute role="spso">
              <SPSO />
            </PrivateRoute>
          }
        />
        <Route
          path="/adminpage"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />

        {/* Các route công khai khác */}
        <Route path="/403" element={<Forbidden />} />
      </Routes>
    </div>
  );
}

export default App;
