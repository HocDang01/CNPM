import React, { useState, useEffect } from "react";
import "../css/ViewReport.css";

const ViewReport = () => {
  const reportsPerPage = 14; // Số báo cáo mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [filterTime, setFilterTime] = useState("all");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        const response = await fetch("/spso/printer/issues", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch reports");
        }

        const data = await response.json();
        if (data.status === "success") {
          setReports(data.data);
          setFilteredReports(data.data); // Lưu báo cáo vào filteredReports
        } else {
          throw new Error("Unexpected response format");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // Hàm tìm kiếm
  const handleSearch = () => {
    const filtered = reports.filter((report) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        report["student email"].toLowerCase().includes(searchLower) ||
        report["student name"].toLowerCase().includes(searchLower) ||
        report["printer name"].toLowerCase().includes(searchLower)
      );
    });
    setFilteredReports(filtered);
  };

  // Hàm sắp xếp theo thời gian
  const handleSort = (order) => {
    setSortOrder(order);
    const sortedReports = [...filteredReports].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return order === "desc" ? dateB - dateA : dateA - dateB;
    });
    setFilteredReports(sortedReports);
  };

  // Hàm lọc theo thời gian
const handleTimeFilter = (timePeriod) => {
  setFilterTime(timePeriod);
  const now = new Date();
  let filteredByTime = [...reports];

  if (timePeriod === "1day") {
    filteredByTime = filteredByTime.filter((report) => {
      const reportDate = new Date(report.date);
      return now - reportDate <= 24 * 60 * 60 * 1000;
    });
  } else if (timePeriod === "1week") {
    filteredByTime = filteredByTime.filter((report) => {
      const reportDate = new Date(report.date);
      return now - reportDate <= 7 * 24 * 60 * 60 * 1000;
    });
  } else if (timePeriod === "1month") {
    filteredByTime = filteredByTime.filter((report) => {
      const reportDate = new Date(report.date);
      return now - reportDate <= 30 * 24 * 60 * 60 * 1000;
    });
  } else if (timePeriod === "1year") {
    filteredByTime = filteredByTime.filter((report) => {
      const reportDate = new Date(report.date);
      return now - reportDate <= 365 * 24 * 60 * 60 * 1000;
    });
  }

  setFilteredReports(filteredByTime);
};

  // Lấy báo cáo hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filteredReports.slice(startIndex, startIndex + reportsPerPage);

  // Tính tổng số trang
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Lỗi: {error}</div>;
  }

  return (
    <div className="view-report-container">
      {/* Tìm kiếm */}
      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo email, tên học sinh, tên máy in"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleSearch}>Tìm kiếm</button>
      </div>

      {/* Lọc theo thời gian */}
      <div className="time-filter">
        <button
          className={filterTime === "1day" ? "active" : ""}
          onClick={() => handleTimeFilter("1day")}
        >
          1 Ngày
        </button>
        <button
          className={filterTime === "1week" ? "active" : ""}
          onClick={() => handleTimeFilter("1week")}
        >
          1 Tuần
        </button>
        <button
          className={filterTime === "1month" ? "active" : ""}
          onClick={() => handleTimeFilter("1month")}
        >
          1 Tháng
        </button>
        <button
          className={filterTime === "1year" ? "active" : ""}
          onClick={() => handleTimeFilter("1year")}
        >
          1 Năm
        </button>
        <button
          className={filterTime === "all" ? "active" : ""}
          onClick={() => handleTimeFilter("all")}
        >
          Tất Cả
        </button>
      </div>

      {/* Sắp xếp theo thời gian */}
      <div className="sort-time">
        <select onChange={(e) => handleSort(e.target.value)} value={sortOrder}>
          <option value="desc">Mới nhất</option>
          <option value="asc">Cũ nhất</option>
        </select>
      </div>

      {/* Bảng báo cáo */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Họ Tên</th>
            <th>Vấn Đề</th>
            <th>Tên Máy In</th>
            <th>Vị Trí</th>
            <th>Thời Gian Gửi</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((report, index) => (
            <tr key={index}>
              <td>{report["student email"]}</td>
              <td>{report["student name"]}</td>
              <td>{report.issue}</td>
              <td>{report["printer name"]}</td>
              <td>{report["printer location"]}</td>
              <td>{report.date}</td>
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
