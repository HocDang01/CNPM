import React, { useState } from "react";
import "../css/HistoryAllPrint.css"; // Tạo một file CSS mới cho trang này

const HistoryAllPrint = () => {
  const reportsPerPage = 10; // Số báo cáo mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm theo tên/email
  const [dateFilter, setDateFilter] = useState("all"); // Bộ lọc thời gian
  const [sortOrder, setSortOrder] = useState("asc"); // Sắp xếp theo ngày in (ascending/descending)

  // Dữ liệu hardcoded
  const data = [
    {
      email: "user1@example.com",
      fullName: "Nguyễn Văn A",
      printedFile: "File báo cáo.pdf",
      printerId: "PR-001",
      printDate: "2024-11-25 09:00",
    },
    {
      email: "user2@example.com",
      fullName: "Trần Thị B",
      printedFile: "Hướng dẫn sử dụng.docx",
      printerId: "PR-002",
      printDate: "2024-11-24 15:30",
    },
    {
      email: "user3@example.com",
      fullName: "Lê Văn C",
      printedFile: "Tài liệu kế toán.xlsx",
      printerId: "PR-003",
      printDate: "2024-11-23 14:20",
    },
    {
      email: "user4@example.com",
      fullName: "Phạm Văn D",
      printedFile: "Đề tài nghiên cứu.pdf",
      printerId: "PR-004",
      printDate: "2024-11-22 11:10",
    },
    {
      email: "user5@example.com",
      fullName: "Nguyễn Thị E",
      printedFile: "Hợp đồng ký kết.pdf",
      printerId: "PR-005",
      printDate: "2024-11-20 16:45",
    },
    // Thêm dữ liệu mẫu nữa để đủ phân trang
  ];

  // Hàm để lọc dữ liệu theo tên/email và khoảng thời gian
  const filterData = () => {
    let filteredData = data;

    // Lọc theo tên/email
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo khoảng thời gian
    if (dateFilter !== "all") {
      const now = new Date();
      const pastDate = new Date(now.setDate(now.getDate() - dateFilter));
      filteredData = filteredData.filter((item) => new Date(item.printDate) > pastDate);
    }

    // Sắp xếp theo ngày in
    if (sortOrder === "asc") {
      filteredData.sort((a, b) => new Date(a.printDate) - new Date(b.printDate));
    } else {
      filteredData.sort((a, b) => new Date(b.printDate) - new Date(a.printDate));
    }

    return filteredData;
  };

  // Lấy dữ liệu hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filterData().slice(startIndex, startIndex + reportsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(filterData().length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="history-all-print">
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
          <option value="all">Tất cả</option>
          <option value="1">1 ngày</option>
          <option value="7">1 tuần</option>
          <option value="30">1 tháng</option>
          <option value="365">1 năm</option>
        </select>

        <select onChange={(e) => setSortOrder(e.target.value)} value={sortOrder}>
          <option value="asc">Sắp xếp từ cũ đến mới</option>
          <option value="desc">Sắp xếp từ mới đến cũ</option>
        </select>
      </div>

      <table className="history-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Họ Tên</th>
            <th>File Đã In</th>
            <th>ID Máy In</th>
            <th>Ngày In</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((item, index) => (
            <tr key={index}>
              <td>{item.email}</td>
              <td>{item.fullName}</td>
              <td>{item.printedFile}</td>
              <td>{item.printerId}</td>
              <td>{item.printDate}</td>
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

export default HistoryAllPrint;
