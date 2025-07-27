import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="py-5">
      <Row>
        <Col>
          <div className="text-center mb-5">
            <h1>About ShopEase</h1>
            <p className="lead text-muted">
              Your trusted online shopping destination
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-5">
        <Col md={6}>
          <h3>Our Story</h3>
          <p>
            Founded with a mission to make online shopping accessible and enjoyable for everyone, 
            ShopEase has grown to become a trusted platform for quality products at competitive prices.
          </p>
          <p>
            We believe in the power of technology to connect customers with the products they love, 
            while ensuring secure transactions and exceptional customer service.
          </p>
        </Col>
        <Col md={6}>
          <img 
            src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" 
            alt="About us" 
            className="img-fluid rounded"
          />
        </Col>
      </Row>

      <Row className="mb-5">
        <Col>
          <h3 className="text-center mb-4">Why Choose ShopEase?</h3>
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-shield-check fs-2"></i>
              </div>
              <h5>Secure Payments</h5>
              <p className="text-muted">
                All transactions are protected by Moniepoint's advanced security technology.
              </p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-truck fs-2"></i>
              </div>
              <h5>Fast Delivery</h5>
              <p className="text-muted">
                Quick and reliable shipping to get your products to you safely and on time.
              </p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-star fs-2"></i>
              </div>
              <h5>Quality Products</h5>
              <p className="text-muted">
                We carefully curate our product selection to ensure you get the best value.
              </p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-headset fs-2"></i>
              </div>
              <h5>24/7 Support</h5>
              <p className="text-muted">
                Our customer service team is always ready to help you with any questions.
              </p>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="bg-primary text-white text-center">
            <Card.Body className="py-5">
              <h3>Ready to Start Shopping?</h3>
              <p className="lead mb-0">
                Join thousands of satisfied customers and experience the ShopEase difference today.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default About;