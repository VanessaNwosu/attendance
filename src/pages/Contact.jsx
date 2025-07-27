import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [showAlert, setShowAlert] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setShowAlert(true);
    setFormData({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setShowAlert(false), 5000);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="text-center mb-5">
            <h1>Contact Us</h1>
            <p className="lead text-muted">
              We'd love to hear from you. Get in touch with us!
            </p>
          </div>
        </Col>
      </Row>

      {showAlert && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          Thank you for your message! We'll get back to you within 24 hours.
        </Alert>
      )}

      <Row>
        {/* Contact Information */}
        <Col lg={4} className="mb-4">
          <Card className="h-100">
            <Card.Header>
              <h5 className="mb-0">Get In Touch</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-geo-alt text-primary fs-4 me-3"></i>
                  <div>
                    <strong>Address</strong>
                    <p className="text-muted mb-0">
                      123 Commerce Street<br />
                      Victoria Island, Lagos<br />
                      Nigeria
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-telephone text-primary fs-4 me-3"></i>
                  <div>
                    <strong>Phone</strong>
                    <p className="text-muted mb-0">
                      <a href="tel:+2348001234567" className="text-decoration-none">
                        +234 800 123 4567
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-envelope text-primary fs-4 me-3"></i>
                  <div>
                    <strong>Email</strong>
                    <p className="text-muted mb-0">
                      <a href="mailto:support@shopease.com" className="text-decoration-none">
                        support@shopease.com
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="d-flex align-items-start">
                  <i className="bi bi-clock text-primary fs-4 me-3"></i>
                  <div>
                    <strong>Business Hours</strong>
                    <p className="text-muted mb-0">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-top pt-3">
                <h6>Payment Partner</h6>
                <div className="d-flex align-items-center">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  <span>Powered by <strong>Moniepoint</strong></span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact Form */}
        <Col lg={8}>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Send Us a Message</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Subject *</Form.Label>
                  <Form.Select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Customer Support</option>
                    <option value="orders">Order Issues</option>
                    <option value="payment">Payment Questions</option>
                    <option value="shipping">Shipping Information</option>
                    <option value="returns">Returns & Refunds</option>
                    <option value="feedback">Feedback</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Message *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={5}
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Please describe your inquiry in detail..."
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    <i className="bi bi-send me-2"></i>
                    Send Message
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FAQ Section */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Frequently Asked Questions</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>How do I track my order?</h6>
                  <p className="text-muted">
                    You'll receive a tracking number via email once your order ships. 
                    You can use this to track your package.
                  </p>
                  
                  <h6>What payment methods do you accept?</h6>
                  <p className="text-muted">
                    We accept all major payment methods through our secure Moniepoint gateway, 
                    including bank transfers, debit/credit cards, and mobile money.
                  </p>
                </Col>
                <Col md={6}>
                  <h6>What is your return policy?</h6>
                  <p className="text-muted">
                    We offer a 30-day return policy for most items. Products must be 
                    in original condition with tags attached.
                  </p>
                  
                  <h6>How long does shipping take?</h6>
                  <p className="text-muted">
                    Standard shipping takes 2-5 business days. Free shipping is available 
                    on orders over ₦10,000.
                  </p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;