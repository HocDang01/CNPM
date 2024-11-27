import React, { useState } from "react";
import "../css/ViewReport.css";

const ViewReport = () => {
  const reportsPerPage = 14; // Số báo cáo mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  // Danh sách báo cáo mẫu
  const reports = [
    {id: "1", email: "user1@example.com", name: "Nguyễn Văn A", issue: "Lỗi in ấn", details: "Máy in không hoạt động.", time: "2024-11-25 10:00" },
    {id: "2", email: "user2@example.com", name: "Trần Thị B", issue: "Kết nối mạng", details: "Không thể kết nối tới máy in qua mạng.", time: "2024-11-25 11:00" },
    {id: "3", email: "user3@example.com", name: "Lê Văn C", issue: "Lỗi phần mềm", details: "Phần mềm không nhận máy in.", time: "2024-11-25 12:00" },
    {id: "4", email: "user4@example.com", name: "Phạm Văn D", issue: "Hết mực in", details: "Máy in báo hết mực dù vừa thay.", time: "2024-11-25 13:00" },
    {id: "5", email: "user5@example.com", name: "Nguyễn Thị E", issue: "Lỗi cài đặt", details: "Không cài đặt được trình điều khiển máy in.", time: "2024-11-25 14:00" },
    {id: "6", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "7", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "8", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "9", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "10", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "11", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "12", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "13", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "14", email: "user6@example.com", name: "Vũ Văn F", issue: "Lỗi phần cứng", details: "Máy in không nhận giấy.", time: "2024-11-25 15:00" },
    {id: "15", email: "user5@example.com", name: "Nguyễn Thị E", issue: "Lỗi cài đặt", details: "Không cài đặt được trình điều khiển máy in.", time: "2024-11-25 14:00" },

  ];

  // Lấy báo cáo hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = reports.slice(startIndex, startIndex + reportsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(reports.length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="view-report-container">
      <table className="report-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Email</th>
            <th>Họ Tên</th>
            <th>Vấn Đề</th>
            <th>Chi Tiết</th>
            <th>Thời Gian Gửi</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((report, index) => (
            <tr key={index}>
                <td>{report.id}</td>
                <td>{report.email}</td>
                <td>{report.name}</td>
                <td>{report.issue}</td>
                <td>{report.details}</td>
                <td>{report.time}</td>
              <td>
                <button className="detail-button">Xem Chi Tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thanh phân trang */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ViewReport;
