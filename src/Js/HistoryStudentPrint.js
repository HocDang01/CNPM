import React, { useState, useEffect } from "react";
import { Table, Form, Button, Pagination, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/HistoryStudentPrint.css";

const HistoryStudentPrint = () => {
  const reportsPerPage = 10; // Số báo cáo mỗi trang
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Tìm kiếm theo tên/email
  const [dateFilter, setDateFilter] = useState("all"); // Bộ lọc thời gian
  const [sortOrder, setSortOrder] = useState("asc"); // Sắp xếp theo ngày in (ascending/descending)
  const [data, setData] = useState([]); // Dữ liệu từ API
  const [loading, setLoading] = useState(true); // Trạng thái loading

  // Fetch dữ liệu từ API
  const fetchReports = async () => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");

    try {
      const response = await fetch("http://localhost:5000/spso/printer/export_printing_report", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role: userRole,
        },
      });
      const result = await response.json();
      if (result.status === "success") {
        setData(result.report);
      } else {
        console.error("Error fetching data", result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  // Hàm để lọc dữ liệu theo tên/email và khoảng thời gian
  const filterData = () => {
    let filteredData = data;

    // Lọc theo tên/email
    if (searchQuery) {
      filteredData = filteredData.filter(
        (item) =>
          item.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Lọc theo khoảng thời gian
    if (dateFilter !== "all") {
      const now = new Date();
      const pastDate = new Date(now.setDate(now.getDate() - parseInt(dateFilter, 10)));
      filteredData = filteredData.filter(
        (item) => new Date(item.date) > pastDate
      );
    }

    // Sắp xếp theo ngày in
    if (sortOrder === "asc") {
      filteredData.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );
    } else {
      filteredData.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
    }

    return filteredData;
  };

  // Lấy dữ liệu hiển thị trên trang hiện tại
  const startIndex = (currentPage - 1) * reportsPerPage;
  const currentReports = filterData().slice(
    startIndex,
    startIndex + reportsPerPage
  );

  // Tính tổng số trang
  const totalPages = Math.ceil(filterData().length / reportsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-4">
      <Row className="mb-3">
        <Col md={4}>
          <Form.Control
            type="text"
            placeholder="Tìm theo tên hoặc email"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Col>
        <Col md={4}>
          <Form.Select
            onChange={(e) => setDateFilter(e.target.value)}
            value={dateFilter}
          >
            <option value="all">Tất cả</option>
            <option value="1">1 ngày</option>
            <option value="7">1 tuần</option>
            <option value="30">1 tháng</option>
            <option value="365">1 năm</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Select
            onChange={(e) => setSortOrder(e.target.value)}
            value={sortOrder}
          >
            <option value="asc">Sắp xếp từ cũ đến mới</option>
            <option value="desc">Sắp xếp từ mới đến cũ</option>
          </Form.Select>
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>File Đã In</th>
            <th>ID Máy In</th>
            <th>Tên Máy In</th>
            <th>Vị Trí Máy In</th>
            <th>Số Trang</th>
            <th>Ngày In</th>
            <th>Email</th>
            <th>Tên Sinh Viên</th>
          </tr>
        </thead>
        <tbody>
          {currentReports.map((item, index) => (
            <tr key={index}>
              <td>{item.file_name}</td>
              <td>{item.printer_id}</td>
              <td>{item["printer name"]}</td>
              <td>{item["printer location"]}</td>
              <td>{item.pages}</td>
              <td>{item.date}</td>
              <td>{item.email}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Thanh phân trang */}
      <Pagination>
        {Array.from({ length: totalPages }, (_, index) => (
          <Pagination.Item
            key={index}
            active={currentPage === index + 1}
            onClick={() => handlePageChange(index + 1)}
          >
            {index + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </div>
  );
};

export default HistoryStudentPrint;