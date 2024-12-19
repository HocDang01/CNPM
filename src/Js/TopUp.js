import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Container, Form, Button, Row, Col } from "react-bootstrap";
import "../css/TopUp.css";

const TopUp = () => {
  const [pages, setPages] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [qrValue, setQrValue] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [addPageStatus, setAddPageStatus] = useState("");

  const handleInputChange = (e) => {
    const numPages = e.target.value;
    setPages(numPages);
    setTotalAmount(numPages * 230); // Calculate total cost
  };

  const generateQRCode = async () => {
    if (totalAmount > 0) {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://127.0.0.1:5000/momo/create_payment", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            student_id: "<your_student_id>", // Replace with dynamic student ID if available
            page: parseInt(pages),
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await response.json();
        setQrValue(data.payUrl);
      } catch (error) {
        console.error("Error generating QR code:", error);
        alert("Failed to generate QR code.");
      }
    }
  };

  const Buy = async () => {
    alert('Đã tạo đơn thành công, hãy vào mybk để thanh toán')
  }

  const checkPaymentStatus = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/momo/callback", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error("Failed to check payment status");
      }

      const data = await response.json();
      if (data.status === "success") {
        setPaymentStatus(`Payment successful: ${data.message}`);
        addPagesToAccount(data.page); // Use the page value from the response
      } else {
        setPaymentStatus("Payment status unknown.");
      }
    } catch (error) {
      console.error("Error checking payment status:", error);
      setPaymentStatus("Failed to check payment status.");
    }
  };

  const addPagesToAccount = async (pageCount) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/student/add_page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          Role: "Student",
        },
        body: JSON.stringify({
          student_id: "<your_student_id>", // Replace with dynamic student ID if available
          page: pageCount,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add pages to account");
      }

      const data = await response.json();
      if (data.status === "success") {
        setAddPageStatus(data.message);
      } else {
        setAddPageStatus("Failed to add pages to account.");
      }
    } catch (error) {
      console.error("Error adding pages to account:", error);
      setAddPageStatus("Failed to add pages to account.");
    }
  };

  return (
    <Container className="top-up-container">
      <h1 className="my-4 top-up-title">Top Up for Printing</h1>
      <Form className="top-up-form">
        <Form.Group
          as={Row}
          controlId="formPages"
          className="top-up-form-group"
        >
          <Form.Label column sm="2" className="top-up-label">
            Number of Pages:
          </Form.Label>
          <Col sm="10" className="top-up-input-col">
            <Form.Control
              type="number"
              value={pages}
              onChange={handleInputChange}
              className="top-up-input"
            />
          </Col>
        </Form.Group>
        <Form.Group
          as={Row}
          controlId="formTotalAmount"
          className="top-up-form-group"
        >
          <Form.Label column sm="2" className="top-up-label">
            Total Amount (VND):
          </Form.Label>
          <Col sm="10" className="top-up-input-col">
            <Form.Control
              type="text"
              value={totalAmount}
              readOnly
              className="top-up-input"
            />
          </Col>
        </Form.Group>
        <Button
          variant="primary"
          onClick={Buy}
          className="mt-3 top-up-button"
        >
          Mua
        </Button>
      </Form>
      {qrValue && (
        <div className="mt-4 top-up-qr-container">
          <h2 className="top-up-qr-title">Scan this QR code to pay</h2>
          <QRCodeCanvas value={qrValue} className="top-up-qr-code" />
        </div>
      )}
      <Button
        variant="secondary"
        onClick={checkPaymentStatus}
        className="mt-3 top-up-check-button"
      >
        Kiểm tra thanh toán
      </Button>
      {paymentStatus && (
        <div className="mt-3 payment-status">
          <p>{paymentStatus}</p>
        </div>
      )}
      {addPageStatus && (
        <div className="mt-3 add-page-status">
          <p>{addPageStatus}</p>
        </div>
      )}
    </Container>
  );
};

export default TopUp;
