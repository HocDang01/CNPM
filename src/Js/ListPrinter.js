import React, { useState, useEffect } from "react";
import "../css/ListPrinter.css"; // File CSS cho trang này
import { type } from "@testing-library/user-event/dist/type";

const ListPrinter = () => {
  const [printers, setPrinters] = useState([]);
  const [showAddPrinterModal, setShowAddPrinterModal] = useState(false);
  const [newPrinter, setNewPrinter] = useState({
    id: "",
    remainingPages: 0,
    status: "Enabled",
    location: "", // Thêm vị trí đặt vào state
  });
  const [showEditPrinterModal, setShowEditPrinterModal] = useState(false); 
  const [editPrinter, setEditPrinter] = useState(null); // Thêm state để lưu thông tin máy in cần sửa
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

  const handleAddPrinter = async () => {
    // Kiểm tra trùng tên máy in
    const isDuplicate = printers.some((printer) => printer.name === newPrinter.id);
    if (isDuplicate) {
      alert("Tên máy in đã tồn tại.");
      return;
    }
  
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");
  
    // Construct the printer data to send
    const printerData = {
      name: newPrinter.id, // Mapping 'id' input to 'name'
      model: newPrinter.model || "HP LaserJet 200", // Default if not entered
      type: newPrinter.type || "Laser", // Default
      manufacturer: newPrinter.manufacturer || "HP", // Default
      purchase_date: newPrinter.purchase_date || "2024-01-15", // Default date
      paper_count: newPrinter.remainingPages || 500, // Default
      status: newPrinter.status === "Enabled" ? "Enabled" : "Disabled", // User-selected status
      location: newPrinter.location || "Không xác định", // Default location
      maintenance_history: [], // Default empty
      report_history: [], // Default empty
      print_history: [], // Default empty
      ink: {
        type: "Black", // Default
        level: newPrinter.inkLevel || 100, // Default
        max_print_pages: 1600,  //default
      },
    };
  
    try {
      const response = await fetch(`/spso/printer/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role: userRole,
        },
        body: JSON.stringify(printerData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.message === "All fields are required") {
          setErrorMessage("Tất cả các trường là bắt buộc. Vui lòng kiểm tra và thử lại.");
        } else {
          setErrorMessage("Lỗi khi thêm máy in.");
        }
        setTimeout(() => setErrorMessage(""), 3000);
        return;
      }
  
      const addedPrinter = await response.json();
  
      if (addedPrinter.data) {
        // Kiểm tra dữ liệu trước khi thêm vào state
        setPrinters((prevPrinters) => [...prevPrinters, addedPrinter.data]); // Add newly created printer
      }
  
      setSuccessMessage("Thêm máy in thành công.");
      setTimeout(() => setSuccessMessage(""), 3000);
  
      // Reset form and close modal
      setShowAddPrinterModal(false);
      setNewPrinter({
        id: "",
        remainingPages: 0,
        inkLevel: 100, 
        status: "Enabled",
        location: "",
      });
      setErrorMessage("");
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi thêm máy in.");
      setTimeout(() => setSuccessMessage(""), 3000);
      console.error(error);
    }
  };

  const handleDeletePrinter = async (id) => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");
  
    // Xác nhận trước khi xóa
    if (!window.confirm("Bạn có chắc chắn muốn xóa máy in này?")) return;
  
    try {
      const response = await fetch(`/spso/printer/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role: userRole,
        },
      });
  
      if (!response.ok) {
        throw new Error("Lỗi khi xóa máy in.");
      }
  
      // Cập nhật lại danh sách máy in sau khi xóa thành công
      setPrinters(printers.filter((printer) => printer._id !== id));
  
      setSuccessMessage("Xóa máy in thành công.");
      setTimeout(() => setSuccessMessage(""), 3000); // Ẩn thông báo sau 3 giây
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi xóa máy in.");
      setTimeout(() => setErrorMessage(""), 3000); // Ẩn thông báo sau 3 giây
      console.error(error);
    }
  };
  const handleEditPrinter = (printer) => {
    printer.inkLevel = printer.ink?.level || 0;
    setEditPrinter(printer); // Lưu máy in cần chỉnh sửa vào state
    setShowEditPrinterModal(true); // Hiển thị modal chỉnh sửa
  };

  const handleUpdatePrinter = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");

    // Chuẩn bị dữ liệu để gửi lên API
    const updatedPrinter = {
      name: editPrinter.name,
      type: editPrinter.type, // Hard code
      model: editPrinter.model,
      location: editPrinter.location,
      manufacturer: editPrinter.manufacturer,
      purchase_date: editPrinter.purchase_date,
      paper_count: editPrinter.paper_count,
      ink: {
        type: "Black", // Hard code
        level: editPrinter.inkLevel || 100,
        max_print_pages: 1600, // Hard code
      },
    };

    try {
      const response = await fetch(`/spso/printer/${editPrinter._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          role: userRole,
        },
        body: JSON.stringify(updatedPrinter),
      });

      if (!response.ok) {
        throw new Error("Lỗi khi cập nhật máy in.");
      }

      // Cập nhật lại danh sách máy in sau khi sửa
      setPrinters(printers.map((printer) =>
        printer._id === editPrinter._id ? { ...printer, ...updatedPrinter } : printer
      ));

      setSuccessMessage("Cập nhật máy in thành công.");
      setTimeout(() => setSuccessMessage(""), 3000);

      // Đóng modal sau khi sửa thành công
      setShowEditPrinterModal(false);
      setEditPrinter(null);
    } catch (error) {
      setErrorMessage("Có lỗi xảy ra khi cập nhật máy in.");
      setTimeout(() => setErrorMessage(""), 3000);
      console.error(error);
    }
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
            <th>Ngày Mua</th> 
            <th>Số Giấy Còn Lại</th>
            <th>Số Mực Còn Lại</th>
            <th>Vị trí đặt</th>
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
              <td>{printer.purchase_date || "N/A"}</td> 
              <td>{printer.paper_count}</td>
              <td>{printer.ink.level} %</td>
              <td>{printer.location}</td>
              <td>{printer.status}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEditPrinter(printer)}>Cập nhật</button>
                <button
                  className="disable-btn"
                  onClick={() => handleEnableDisable(printer._id, printer.status)}
                >
                  {printer.status === "Enabled" ? "Disable" : "Enable"}
                </button>
                <button
                  className="delete-btn"
                  onClick={() => handleDeletePrinter(printer._id)} // Gọi hàm handleDeletePrinter khi nhấn nút Xóa
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Modal chỉnh sửa máy in */}
      {showEditPrinterModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {/* <button
              className="close-modal-btn"
              onClick={() => setShowEditPrinterModal(false)}
            >
              X
            </button> */}
            <h2>Cập nhật Máy In</h2>

            <form onSubmit={handleUpdatePrinter}>
              <div className="form-group">
                <label>Tên máy in:</label>
                <input
                  type="text"
                  value={editPrinter.name}
                  onChange={(e) =>
                    setEditPrinter({ ...editPrinter, name: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Loại máy in:</label>
                <input
                  type="text"
                  value={editPrinter.type}
                  onChange={(e) =>
                    setEditPrinter({ ...editPrinter, type: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Kiểu máy in:</label>
                <input
                  type="text"
                  value={editPrinter.model}
                  onChange={(e) =>
                    setEditPrinter({ ...editPrinter, model: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Nhà sản xuất:</label>
                <input
                  type="text"
                  value={editPrinter.manufacturer}
                  onChange={(e) =>
                    setEditPrinter({ ...editPrinter, manufacturer: e.target.value })
                  }
                />
              </div>
              <div className="form-group">
                <label>Ngày Mua:</label>
                <input
                  type="date"
                  value={editPrinter.purchase_date}
                  onChange={(e) => setEditPrinter({ ...editPrinter, purchase_date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Vị trí đặt:</label>
                <input
                  type="text"
                  value={editPrinter.location}
                  onChange={(e) =>
                    setEditPrinter({
                      ...editPrinter,
                      location: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Số Giấy còn lại:</label>
                <input
                  type="number"
                  value={editPrinter.paper_count}
                  onChange={(e) =>
                    setEditPrinter({
                      ...editPrinter,
                      paper_count: e.target.value,
                    })
                  }
                />
              </div>
              <div className="form-group">
                <label>Số Mực còn lại:</label>
                <input
                  type="number"
                  value={editPrinter.inkLevel}
                  onChange={(e) =>
                    setEditPrinter({
                      ...editPrinter,
                      inkLevel: Number(e.target.value), 
                    })
                  }
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditPrinterModal(false)}
                >
                  Hủy
                </button>
                <button type="submit">Lưu</button>
              </div>
            </form>
          </div>
        </div>
      )}



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
              <label>Loại Máy In:</label>
              <input
                type="text"
                value={newPrinter.type}
                onChange={(e) => setNewPrinter({ ...newPrinter, type: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Kiểu Máy In:</label>
              <input
                type="text"
                value={newPrinter.model}
                onChange={(e) => setNewPrinter({ ...newPrinter, model: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Nhà Sản Xuất:</label>
              <input
                type="text"
                value={newPrinter.manufacturer}
                onChange={(e) => setNewPrinter({ ...newPrinter, manufacturer: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Ngày Mua:</label>
              <input
                type="date"
                value={newPrinter.purchase_date}
                onChange={(e) => setNewPrinter({ ...newPrinter, purchase_date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Số Giấy Còn Lại:</label>
              <input
                type="number"
                value={newPrinter.remainingPages}
                onChange={(e) =>
                  setNewPrinter({ ...newPrinter, remainingPages: parseInt(e.target.value, 10) })
                }
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Vị trí đặt:</label>
              <input
                type="text"
                value={newPrinter.location}
                onChange={(e) => setNewPrinter({ ...newPrinter, location: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Số Mực Còn Lại:</label>
              <input
                type="number"
                value={newPrinter.inkLevel || 100}  // Đảm bảo có giá trị mặc định cho mức mực
                onChange={(e) =>
                  setNewPrinter({
                    ...newPrinter,
                    inkLevel: parseInt(e.target.value, 10),
                  })
                }
                required
                min="0"
              />
            </div>


            <div className="form-group">
              <label>Trạng Thái:</label>
              <select
                value={newPrinter.status}
                onChange={(e) => setNewPrinter({ ...newPrinter, status: e.target.value })}
              >
                <option value="Enabled">Enabled</option>
                <option value="Disabled">Disabled</option>
              </select>
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
