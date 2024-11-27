import React, { useState } from "react";
import "../css/SPSOAccount.css"; // File CSS giống với ListPrinter

const SPSOAccount = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, email: "john.doe@example.com", name: "John Doe", phone: "0123456789", birthYear: "1990", address: "123 Main St", password: "password123" },
    { id: 2, email: "jane.smith@example.com", name: "Jane Smith", phone: "0987654321", birthYear: "1985", address: "456 Elm St", password: "securepassword" },
    { id: 3, email: "mark.brown@example.com", name: "Mark Brown", phone: "", birthYear: "", address: "", password: "mypassword" },
    { id: 4, email: "lucy.green@example.com", name: "Lucy Green", phone: "0112233445", birthYear: "1992", address: "789 Pine St", password: "lucypass" },
    { id: 5, email: "david.white@example.com", name: "David White", phone: "0335566778", birthYear: "1988", address: "321 Oak St", password: "davidsecure" },
    // Thêm nhiều dữ liệu để minh họa
    ...Array.from({ length: 50 }, (_, i) => ({
      id: i + 6,
      email: `user${i + 6}@example.com`,
      name: `User ${i + 6}`,
      phone: `01234567${i}`,
      birthYear: `19${80 + (i % 20)}`,
      address: `Address ${i + 6}`,
      password: `password${i + 6}`,
    })),
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" hoặc "edit"
  const [currentAccount, setCurrentAccount] = useState({});
  const [filter, setFilter] = useState("");

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteAccount = (id) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  const handleAddAccount = () => {
    if (!currentAccount.email || !currentAccount.name || !currentAccount.password) {
      alert("Email, Họ tên và Mật khẩu là bắt buộc.");
      return;
    }

    if (modalType === "add") {
      const exists = accounts.some((account) => account.email === currentAccount.email);
      if (exists) {
        alert("Email đã tồn tại.");
        return;
      }
      setAccounts([...accounts, { ...currentAccount, id: accounts.length + 1 }]);
    } else if (modalType === "edit") {
      setAccounts(accounts.map((account) => (account.id === currentAccount.id ? currentAccount : account)));
    }

    setShowModal(false);
    setCurrentAccount({});
  };

  const handleOpenAddAccountModal = () => {
    setCurrentAccount({
      email: "",
      name: "",
      phone: "",
      birthYear: "",
      address: "",
      password: "",
    }); // Đặt lại trạng thái về rỗng
    setModalType("add");
    setShowModal(true);
  };
    

  const filteredAccounts = accounts.filter((account) =>
    [account.id, account.email, account.name, account.phone, account.birthYear, account.address]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  return (
    <div className="account-manager">
      <div className="account-header">
        <button className="add-account-btn" onClick={() => { handleOpenAddAccountModal() }}>
          Thêm tài khoản
        </button>
      </div>

      <div className="filter-container">
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Nhập thông tin để tìm..."
        />
      </div>

      <table className="account-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Năm sinh</th>
            <th>Địa chỉ</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account) => (
            <tr key={account.id}>
              <td>{account.id}</td>
              <td>{account.email}</td>
              <td>{account.name}</td>
              <td>{account.phone || ""}</td>
              <td>{account.birthYear || ""}</td>
              <td>{account.address || ""}</td>
              <td>
                <button className="edit-btn" onClick={() => { setModalType("edit"); setShowModal(true); setCurrentAccount(account); }}>
                  Thay đổi
                </button>
                <button className="delete-btn" onClick={() => handleDeleteAccount(account.id)}>
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{modalType === "add" ? "Thêm tài khoản mới" : "Thay đổi tài khoản"}</h2>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={currentAccount.email || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, email: e.target.value })}
                disabled={modalType === "edit"} // Không thay đổi email khi chỉnh sửa
              />
            </div>
            <div className="form-group">
              <label>Họ tên:</label>
              <input
                type="text"
                value={currentAccount.name || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Số điện thoại:</label>
              <input
                type="text"
                value={currentAccount.phone || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Năm sinh:</label>
              <input
                type="text"
                value={currentAccount.birthYear || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, birthYear: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Địa chỉ:</label>
              <input
                type="text"
                value={currentAccount.address || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, address: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Mật khẩu:</label>
              <input
                type="password"
                value={currentAccount.password || ""}
                onChange={(e) => setCurrentAccount({ ...currentAccount, password: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button onClick={handleAddAccount}>{modalType === "add" ? "Thêm" : "Lưu"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SPSOAccount;
