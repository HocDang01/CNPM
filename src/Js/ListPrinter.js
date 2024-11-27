import React, { useState } from "react";
import "../css/ListPrinter.css"; // File CSS cho trang này

const ListPrinter = () => {
  const [printers, setPrinters] = useState([
    { id: "PR-001", remainingPages: 100, status: "Enabled" },
    { id: "PR-002", remainingPages: 50, status: "Disabled" },
    { id: "PR-003", remainingPages: 200, status: "Enabled" },
  ]);
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

  const handleEnableDisable = (id) => {
    setPrinters(printers.map((printer) => {
      if (printer.id === id) {
        const newStatus = printer.status === "Enabled" ? "Disabled" : "Enabled";
        return { ...printer, status: newStatus };
      }
      return printer;
    }));
    setSuccessMessage("Cập nhật trạng thái thành công.");
    setTimeout(() => setSuccessMessage(""), 3000); // Ẩn thông báo sau 3 giây
  };

  const handleAddPrinter = () => {
    // Kiểm tra xem máy in đã tồn tại chưa
    const exists = printers.some((printer) => printer.id === newPrinter.id);
    if (exists) {
      setErrorMessage("ID máy in đã tồn tại.");
      return;
    }

    // Thêm máy in mới vào danh sách
    setPrinters([...printers, newPrinter]);
    setSuccessMessage("Thêm máy in thành công.");
    setTimeout(() => setSuccessMessage(""), 3000); // Ẩn thông báo sau 3 giây

    // Đóng modal
    setShowAddPrinterModal(false);
    setNewPrinter({ id: "", remainingPages: 0, status: "Enabled" });
    setErrorMessage("");
  };

  const handleFilterChange = () => {
    // Logic để lọc dữ liệu theo ID và số tờ còn lại
  };

  const filteredPrinters = printers.filter((printer) => {
    const filterById = filterId ? printer.id.includes(filterId) : true;
    const filterByPages =
      filterPages === "0-50"
        ? printer.remainingPages <= 50
        : filterPages === "50-100"
        ? printer.remainingPages > 50 && printer.remainingPages <= 100
        : filterPages === "100-200"
        ? printer.remainingPages > 100 && printer.remainingPages <= 200
        : filterPages === "200+"
        ? printer.remainingPages > 200
        : true;

    return filterById && filterByPages;
  });

  return (
    <div className="list-printer">
      <div className="list-printer-header">
        {/* Nút Add Printer */}
        <button className="add-printer-btn" onClick={() => setShowAddPrinterModal(true)}>
          Thêm máy in
        </button>

        {/* Thông báo */}
        {successMessage && <div className="success-message">{successMessage}</div>}
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>

      {/* Bộ lọc */}
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
            <th>ID Máy In</th>
            <th>Số Tờ Còn Lại</th>
            <th>Trạng Thái</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {filteredPrinters.map((printer) => (
            <tr key={printer.id}>
              <td>{printer.id}</td>
              <td>{printer.remainingPages}</td>
              <td>{printer.status}</td>
              <td>
                <button onClick={() => handleEnableDisable(printer.id)}>
                  {printer.status === "Enabled" ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Add Printer */}
      {showAddPrinterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Thêm Máy In Mới</h2>
            <div className="form-group">
              <label>ID Máy In:</label>
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
