import React, { useState, useEffect } from "react";
import "../css/SPSOAccount.css"; // File CSS giống với ListPrinter

const SPSOAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(16);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // "add" hoặc "edit"
  const [currentAccount, setCurrentAccount] = useState({});
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAccounts = async () => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");
  
    setLoading(true);
    setError(null);
  
    try {
      const response = await fetch("/spso/account/?role=student", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Phải bao gồm từ khóa "Bearer"
          role: userRole, // Đúng với Postman
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
      if (data.status === "success") {
        const formattedAccounts = data.data.map((account) => ({
          id: account._id,
          email: account.email,
          name: account.name || "",
          phone: account.phone || "",
        }));
        setAccounts(formattedAccounts);
      } else {
        throw new Error("Phản hồi không hợp lệ từ API.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDeleteAccount = async (email) => {
    const token = localStorage.getItem("access_token"); // Lấy token từ localStorage
    
    try {
      const response = await fetch("/account/delete", {
        method: "DELETE",  // Phương thức DELETE để xóa tài khoản
        headers: {
          "Content-Type": "application/json",  // Đảm bảo rằng dữ liệu gửi đi là JSON
          Authorization: `Bearer ${token}`,  // Token Bearer để xác thực
        },
        body: JSON.stringify({
          email: email,  // Truyền email của tài khoản cần xóa
        }),
      });
  
      if (!response.ok) {
        throw new Error("Có lỗi khi xóa tài khoản.");
      }
  
      const data = await response.json();
      if (data.message === "Account deleted successfully") {
        // Nếu API trả về thành công, xóa tài khoản khỏi state
        setAccounts(accounts.filter((account) => account.email !== email));
        alert("Tài khoản đã được xóa!");
      } else {
        alert("Có lỗi trong quá trình xóa!");
      }
    } catch (error) {
      setError(error.message);  // Cập nhật lỗi nếu có
      alert(`Lỗi: ${error.message}`);
    }
  };
  

  const handleAddAccount = async () => {
    const { email, name, phone } = currentAccount;
  
    // Kiểm tra nếu email, họ tên và mật khẩu có hợp lệ không
    if (!email || !name || !phone) {
      alert("Email, Họ tên và Số điện thoại là bắt buộc.");
      return;
    }
  
    const token = localStorage.getItem("access_token");
  
    try {
      // Bước 1: Gửi API tạo tài khoản mới
      const response = await fetch("/account/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email,
          role: "student",  // Role mặc định là "spso"
        }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        // Chỉ xử lý lỗi khi phản hồi không thành công
        if (data.message === "Email has already been registered") {
          alert("Email đã được đăng ký");
        } else {
          alert("Có lỗi khi fetch api.");
        }
        return;
      }
  
      if (data.status === "success") {
        // Bước 2: Sau khi tạo tài khoản thành công, chuyển sang chế độ chỉnh sửa (edit)
        // Cập nhật lại danh sách tài khoản mà không cần reload
      setAccounts((prevAccounts) => [
        ...prevAccounts,
        { email, name, phone }, // Thêm tài khoản mới vào state
      ]);
        setModalType("edit");
        setCurrentAccount({ email, name, phone });  // Đưa thông tin vào modal chỉnh sửa
        setShowModal(true);  // Mở modal để chỉnh sửa thông tin
      } else if (data.message === "Email has already been registered"){
        alert("Email đã được đăng ký");
      }else {
        alert("Có lỗi khi tạo tài khoản.");
      }
    } catch (error) {
      setError(error.message);
      alert(`Lỗi: ${error.message}`);
    }
  };
  

  const handleEditAccount = async () => {
    const token = localStorage.getItem("access_token");
    const { email, name, phone } = currentAccount;  // Lấy thông tin tài khoản từ currentAccount
  
    // Kiểm tra xem thông tin có hợp lệ hay không
    if (!email || !name || !phone) {
      alert("Thông tin tài khoản không hợp lệ!");
      return;
    }
  
    try {
      const response = await fetch("/account/modify_data", {
        method: "PUT",  // Sử dụng phương thức PUT
        headers: {
          "Content-Type": "application/json",  // Đảm bảo rằng dữ liệu gửi đi là JSON
          Authorization: `Bearer ${token}`,  // Token Bearer để xác thực
        },
        body: JSON.stringify({
          email: email,
          name: name,
          phone: phone,
        }),
      });
  
      if (!response.ok) {
        throw new Error("Có lỗi khi cập nhật tài khoản.");
      }
  
      const data = await response.json();
      if (data.status === "success") {
        // Nếu API trả về thành công, cập nhật lại state của tài khoản
        setAccounts(accounts.map((account) =>
          account.id === currentAccount.id ? currentAccount : account
        ));
        alert("Cập nhật tài khoản thành công!");
        setShowModal(false);
      } else {
        throw new Error("Lỗi khi phản hồi từ API.");
      }
    } catch (error) {
      setError(error.message);  // Cập nhật lỗi nếu có
      alert(`Lỗi: ${error.message}`);
    }
  };
  

  const handleOpenAddAccountModal = () => {
    setCurrentAccount({
      email: "",
      name: "",
      phone: "",
    }); // Đặt lại trạng thái về rỗng
    setModalType("add");
    setShowModal(true);
  };

  const filteredAccounts = accounts.filter((account) =>
    [account.id, account.email, account.name, account.phone]
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentAccounts = filteredAccounts.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (error) {
    return <div>Có lỗi xảy ra: {error}</div>;
  }

  return (
    <div className="account-manager">
      <div className="account-header">
        <button className="add-account-btn" onClick={() => handleOpenAddAccountModal()}>
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
            <th>Email</th>
            <th>Họ tên</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {currentAccounts.map((account) => (
            <tr key={account.id}>
              <td>{account.email}</td>
              <td>{account.name}</td>
              <td>{account.phone || ""}</td>
              <td>Student</td>
              <td>
                <button className="edit-btn" onClick={() => { setModalType("edit"); setShowModal(true); setCurrentAccount(account); }}>
                  Thay đổi
                </button>
                <button className="delete-btn" onClick={() => handleDeleteAccount(account.email)}>
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
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)}>Hủy</button>
              <button onClick={modalType === "edit" ? handleEditAccount : handleAddAccount}>
                {modalType === "add" ? "Thêm" : "Lưu"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SPSOAccount;
