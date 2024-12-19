import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Card } from "react-bootstrap";
import "../css/CustomerSupport.css";

const CustomerSupport = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    schoolEmail: "",
    phoneNumber: "",
    feedback: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form data submitted:", formData);
  };

  return (
    <Container className="customer-support-container">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body>
              <Card.Title className="text-center mb-4">Hỗ trợ</Card.Title>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formFullName">
                  <Form.Label>Họ và tên:</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="formSchoolEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    name="schoolEmail"
                    value={formData.schoolEmail}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="formPhoneNumber">
                  <Form.Label>SĐT:</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </Form.Group>
                <Form.Group controlId="formFeedback">
                  <Form.Label>Thông tin phản hồi:</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="feedback"
                    value={formData.feedback}
                    onChange={handleChange}
                    required
                    className="mb-3"
                  />
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">
                  Submit
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CustomerSupport;
