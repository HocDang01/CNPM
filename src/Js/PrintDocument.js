import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import "../css/PrintDocument.css";

const PrintDocument = () => {
  const [step, setStep] = useState(1);
  const [printers, setPrinters] = useState([]);
  const [printer, setPrinter] = useState(null);
  const [document, setDocument] = useState(null);
  const [formControl, setFormControl] = useState({
    copies: 1,
    pages: "",
    paperSize: "A4",
    orientation: "Portrait",
  });

  // Fetch printers on component mount
  useEffect(() => {
    const fetchPrinters = async () => {
      try {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");

        const response = await fetch("http://localhost:5000/student/printer", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Role: role,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch printers");
        }

        const data = await response.json();
        setPrinters(data);
      } catch (err) {
        console.error("Error fetching printers:", err);
      }
    };

    fetchPrinters();
  }, []);

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handlePrinterSelect = (printerId) => {
    const selectedPrinter = printers.find((printer) => printer._id === printerId);
    setPrinter(selectedPrinter);
  };

  const handleDocumentUpload = (e) => {
    setDocument(e.target.files[0]);
  };

  const handleFormChange = (e) => {
    const { id, value } = e.target;
    setFormControl((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!printer || !document) {
      alert("Please select a printer and upload a document.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("student_id", "67488c7fbc7fecd8afe2e6f1");
      formData.append("printer_id", "67519ae4fd45debceb5c2f06");
      formData.append("file_name", "Công ty.pdf");
      formData.append("page_count", 1); // Assuming 1 copy equals 1 page for simplicity

      const token = localStorage.getItem("token");

      const userRole = localStorage.getItem("role");

      const response = await fetch("http://localhost:5000/student/print_document", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // Phải bao gồm từ khóa "Bearer"
          role: userRole, // Đúng với Postman
          'Content-Type': 'application/json', // Đảm bảo định dạng JSON
        },
        // body: formData,
        body: JSON.stringify({
          student_id: "67488c7fbc7fecd8afe2e6f1",
          printer_id: printer._id,  // Role mặc định là "spso"
          file_name: document.name,
          page_count: 1
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit the print job");
      }

      const data = await response.json();
      alert(data.message);
    } catch (error) {
      console.error("Error submitting print job:", error);
      alert("Failed to submit the print job.");
    }
  };

  return (
    <div className="print-document">
      {step === 1 && (
        <div className="step step-1">
          <h2 className="step-title">Tải tài liệu</h2>
          <Form.Group controlId="formFile" className="form-group">
            <Form.Control
              type="file"
              onChange={handleDocumentUpload}
              className="form-control"
            />
          </Form.Group>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={!document}
            className="btn-next"
          >
            Tiếp tục
          </Button>
        </div>
      )}
      {step === 2 && (
        <div className="step step-2">
          <h2 className="step-title">Thiết lập trang in</h2>
          <Form className="form">
            <Form.Group controlId="copies" className="form-group">
              <Form.Label>Số bản in:</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={formControl.copies}
                onChange={handleFormChange}
                className="form-control"
              />
            </Form.Group>
            <Form.Group controlId="pages" className="form-group-check-box">
              <Form.Label>Các trang in:</Form.Label>
              <div className="form-check-group">
                <Form.Check
                  type="radio"
                  id="allPages"
                  name="pagesOption"
                  label="Tất cả các trang"
                  checked={formControl.pages === ""}
                  onChange={() =>
                    setFormControl((prev) => ({ ...prev, pages: "" }))
                  }
                  className="form-check"
                />
                <Form.Check
                  type="radio"
                  id="specificPages"
                  name="pagesOption"
                  label="Chọn trang cụ thể"
                  checked={formControl.pages !== ""}
                  onChange={() =>
                    setFormControl((prev) => ({ ...prev, pages: "1" }))
                  }
                  className="form-check"
                />
                {formControl.pages !== "" && (
                  <Form.Control
                    type="text"
                    placeholder="e.g., 1-5, 7, 10-12"
                    value={formControl.pages}
                    onChange={handleFormChange}
                    className="form-control"
                  />
                )}
              </div>
            </Form.Group>
            <Form.Group controlId="paperSize" className="form-group">
              <Form.Label>Khổ giấy:</Form.Label>
              <Form.Select
                value={formControl.paperSize}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="A4">A4</option>
                <option value="A3">A3</option>
                <option value="Letter">Letter</option>
                <option value="Legal">Legal</option>
              </Form.Select>
            </Form.Group>
            <Form.Group controlId="orientation" className="form-group">
              <Form.Label>Hướng in:</Form.Label>
              <Form.Select
                value={formControl.orientation}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="Portrait">Dọc</option>
                <option value="Landscape">Ngang</option>
              </Form.Select>
            </Form.Group>
            <Button
              variant="secondary"
              onClick={handleBack}
              className="btn-back"
            >
              Quay lại
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              className="btn-next"
            >
              Tiếp tục
            </Button>
          </Form>
        </div>
      )}
      {step === 3 && (
        <div className="step step-3">
          <h2 className="step-title">Chọn máy in</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Tên máy in</th>
                <th>Trạng thái</th>
                <th>Số hàng đợi</th>
                <th>Chọn</th>
              </tr>
            </thead>
            <tbody>
              {printers.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.status}</td>
                  <td>{p.print_history.length}</td>
                  <td>
                  <Form.Check
                    type="radio"
                    name="printer"
                    value={p._id}
                    checked={printer && p._id === printer._id}
                    onChange={() => handlePrinterSelect(p._id)}
                    className="form-check"
                  />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Button
            variant="secondary"
            onClick={handleBack}
            className="btn-back"
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            className="btn-next"
          >
            Tiếp tục
          </Button>
        </div>
      )}
      {step === 4 && (
        <div className="step step-4">
          <h2 className="step-title">Xác nhận và in</h2>
          <p>
            <strong>Tài liệu:</strong>{" "}
            {document ? document.name : "No document selected"}
          </p>
          <p>
            <strong>Máy in:</strong>{" "}
            {printer ? printer.name : "No printer selected"}
          </p>
          <p>
            <strong>Số bản in:</strong> {formControl.copies}
          </p>
          <p>
            <strong>Các trang in:</strong>{" "}
            {formControl.pages || "Tất cả các trang"}
          </p>
          <p>
            <strong>Khổ giấy:</strong> {formControl.paperSize}
          </p>
          <p>
            <strong>Hướng in:</strong> {formControl.orientation}
          </p>
          <Button
            variant="secondary"
            onClick={handleBack}
            className="btn-back"
          >
            Quay lại
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="btn-submit"
          >
            In
          </Button>
        </div>
      )}
    </div>
  );
};

export default PrintDocument;
