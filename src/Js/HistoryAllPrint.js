import React, { useState, useEffect } from "react";
import "../css/HistoryAllPrint.css"; // Tạo một file CSS mới cho trang này

const HistoryAllPrint = () => {
  const reportsPerPage = 10; // Số báo cáo mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm theo tên/email
  const [printerSearch, setPrinterSearch] = useState(""); // Tìm kiếm theo tên máy in
  const [locationSearch, setLocationSearch] = useState(""); // Tìm kiếm theo vị trí
  const [dateFilter, setDateFilter] = useState("all"); // Bộ lọc thời gian
  const [sortOrder, setSortOrder] = useState("asc"); // Sắp xếp theo ngày in (ascending/descending)
  const [reports, setReports] = useState([]); // Dữ liệu báo cáo từ API
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Hàm gọi API và lấy dữ liệu
  const fetchReports = async () => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");

    try {
      const response = await fetch("/spso/printer/export_printing_report", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role: userRole,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setReports(data.report);
      } else {
        console.error("Error fetching data", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Kết thúc trạng thái loading
    }
  };

  useEffect(() => {
    fetchReports(); // Gọi API khi component mount
  }, []);

  // Hàm để lọc dữ liệu theo tên/email, máy in, vị trí và khoảng thời gian
  const filterData = () => {
    let filteredData = reports;

    // Lọc theo tên/email
    if (searchQuery) {
      filteredData = filteredData.filter((item) =>
        item.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo tên máy in
    if (printerSearch) {
      filteredData = filteredData.filter((item) =>
        item["printer name"].toLowerCase().includes(printerSearch.toLowerCase())
      );
    }

    // Lọc theo vị trí máy in
    if (locationSearch) {
      filteredData = filteredData.filter((item) =>
        item["printer location"].toLowerCase().includes(locationSearch.toLowerCase())
      );
    }

    // Lọc theo khoảng thời gian
    if (dateFilter !== "all") {
      const now = new Date();
      const pastDate = new Date(now.setDate(now.getDate() - dateFilter));
      filteredData = filteredData.filter((item) => new Date(item.date) > pastDate);
    }

    // Sắp xếp theo ngày in
    if (sortOrder === "asc") {
      filteredData.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else {
      filteredData.sort((a, b) => new Date(b.date) - new Date(a.date));
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

  if (loading) {
    return <div>Loading...</div>; // Hiển thị loading khi dữ liệu đang được tải
  }

  return (
    <div className="history-all-print">
      <div className="filters">
        <input
          type="text"
          placeholder="Tìm theo tên hoặc email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tìm theo máy in"
          value={printerSearch}
          onChange={(e) => setPrinterSearch(e.target.value)}
        />
        <input
          type="text"
          placeholder="Tìm theo vị trí"
          value={locationSearch}
          onChange={(e) => setLocationSearch(e.target.value)}
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
            <th>Số Trang</th>
            <th>Máy In</th>
            <th>Vị Trí</th>
            <th>Ngày In</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((item, index) => (
            <tr key={index}>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.file_name}</td>
              <td>{item.pages}</td>
              <td>{item["printer name"]}</td>
              <td>{item["printer location"]}</td>
              <td>{item.date}</td>
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
