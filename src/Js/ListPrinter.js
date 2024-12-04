import React, { useState, useEffect } from "react";
import "../css/ListPrinter.css"; // File CSS cho trang này

const ListPrinter = () => {
  const [printers, setPrinters] = useState([]);
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    id: "",
    remainingPages: 0,
    status: "Enabled",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [filterId, setFilterId] = useState("");
  const [filterPages, setFilterPages] = useState("");

  // Fetch data from API
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");

    const fetchPrinters = async () => {
      try {
        const response = await fetch("/spso/printer/", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Phải bao gồm từ khóa "Bearer"
            role: userRole, 
          },
        });
        if (response.status === 401) {
          console.log("User token từ URL:", token);
          throw new Error("Token không hợp lệ hoặc hết hạn.");
        }
        if (!response.ok) {
          throw new Error("Lỗi kết nối với API.");
        }
        const data = await response.json();
        setPrinters(data); // Update the state with the fetched data
      } catch (error) {
        console.error("Error fetching printer data:", error);
      }
    };

    fetchPrinters();
  }, []); // Empty array means this effect runs only once, when the component mounts

  const handleEnableDisable = async (id, currentStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const userRole = localStorage.getItem("role");
      // Fetch data to toggle the printer status
      const response = await fetch(`/spso/printer/${id}`, {
        method: "PATCH", // PATCH because we are updating the printer status
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Phải bao gồm từ khóa "Bearer"
          role: userRole, 
        },
        body: JSON.stringify({
          status: currentStatus === "Enabled" ? "Disabled" : "Enabled", // Toggle the status
        }),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật trạng thái máy in.");
      }

      // Update status locally after successful API request
      setPrinters(printers.map((printer) => {
        if (printer._id === id) {
          return { ...printer, status: currentStatus === "Enabled" ? "Disabled" : "Enabled" };
        }
        return printer;
      }));

      setSuccessMessage("Cập nhật trạng thái thành công.");
      setTimeout(() => setSuccessMessage(""), 3000); // Ẩn thông báo sau 3 giây
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thay đổi trạng thái máy in.");
      console.error(error);
    }
  };

  const handleAddPrinter = () => {
    const exists = printers.some((printer) => printer.id === newPrinter.id);
    if (exists) {
      setErrorMessage("ID máy in đã tồn tại.");
      return;
    }

    setPrinters([...printers, newPrinter]);
    setSuccessMessage("Thêm máy in thành công.");
    setTimeout(() => setSuccessMessage(""), 3000); // Ẩn thông báo sau 3 giây

    setShowAddPrinterModal(false);
    setNewPrinter({ id: "", remainingPages: 0, status: "Enabled" });
    setErrorMessage("");
  };

  const filteredPrinters = printers.filter((printer) => {
    const filterById = filterId ? printer.name.includes(filterId) : true;
    const filterByPages =
      filterPages === "0-50"
        ? printer.paper_count <= 50
        : filterPages === "50-100"
        ? printer.paper_count > 50 && printer.paper_count <= 100
        : filterPages === "100-200"
        ? printer.paper_count > 100 && printer.paper_count <= 200
        : filterPages === "200+"
        ? printer.paper_count > 200
        : true;

    return filterById && filterByPages;
  });

  return (
    <div className="list-printer">
      <div className="list-printer-header">
        <button className="add-printer-btn" onClick={() => setShowAddPrinterModal(true)}>
          Thêm máy in
        </button>

        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      <div className="filter-container">
        <label>ID Máy In:</label>
        <input
          type="text"
          value={filterId}
          onChange={(e) => setFilterId(e.target.value)}
          placeholder="Filter by ID"
        />
        <label>Số Tờ Còn Lại:</label>
        <select
          value={filterPages}
          onChange={(e) => setFilterPages(e.target.value)}
        >
          <option value="">Tất Cả</option>
          <option value="0-50">0 - 50</option>
          <option value="50-100">50 - 100</option>
          <option value="100-200">100 - 200</option>
          <option value="200+">Trên 200</option>
        </select>
      </div>

      <table className="printer-table">
        <thead>
          <tr>
            <th>Tên Máy In</th>
            <th>Loại</th>
            <th>Kiểu</th>
            <th>Nhà Sản Xuất</th>
            <th>Số Giấy Còn Lại</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrinters.map((printer) => (
            <tr key={printer._id}>
              <td>{printer.name}</td>
              <td>{printer.type}</td>
              <td>{printer.model}</td>
              <td>{printer.manufacturer}</td>
              <td>{printer.paper_count}</td>
              <td>{printer.status}</td>
              <td>
                <button
                  onClick={() => handleEnableDisable(printer._id, printer.status)}
                >
                  {printer.status === "Enabled" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showAddPrinterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Thêm Máy In Mới</h2>
            <div className="form-group">
              <label>Tên Máy In:</label>
              <input
                type="text"
                value={newPrinter.id}
                onChange={(e) => setNewPrinter({ ...newPrinter, id: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Số Tờ:</label>
              <input
                type="number"
                value={newPrinter.remainingPages}
                onChange={(e) => setNewPrinter({ ...newPrinter, remainingPages: e.target.value })}
                required
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowAddPrinterModal(false)}>Hủy</button>
              <button onClick={handleAddPrinter}>Thêm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListPrinter;
