import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={3} className="mb-4">
            <h5 className="fw-bold mb-3">
              <i className="bi bi-shop me-2"></i>
              ShopEase
            </h5>
            <p className="text-muted">
              Your one-stop destination for quality products at affordable prices. 
              Shop with confidence and enjoy fast, secure delivery.
            </p>
            <div className="d-flex gap-3">
              <a href="#" className="text-light fs-4">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-twitter"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="#" className="text-light fs-4">
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Quick Links</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-muted text-decoration-none">Home</Link>
              </li>
              <li className="mb-2">
                <Link to="/products" className="text-muted text-decoration-none">Products</Link>
              </li>
              <li className="mb-2">
                <Link to="/about" className="text-muted text-decoration-none">About Us</Link>
              </li>
              <li className="mb-2">
                <Link to="/contact" className="text-muted text-decoration-none">Contact</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Categories</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/products?category=electronics" className="text-muted text-decoration-none">Electronics</Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=clothing" className="text-muted text-decoration-none">Clothing</Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=accessories" className="text-muted text-decoration-none">Accessories</Link>
              </li>
              <li className="mb-2">
                <Link to="/products?category=sports" className="text-muted text-decoration-none">Sports</Link>
              </li>
            </ul>
          </Col>
          
          <Col md={2} className="mb-4">
            <h6 className="fw-bold mb-3">Customer Service</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">FAQ</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Shipping Info</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Returns</a>
              </li>
              <li className="mb-2">
                <a href="#" className="text-muted text-decoration-none">Size Guide</a>
              </li>
            </ul>
          </Col>
          
          <Col md={3} className="mb-4">
            <h6 className="fw-bold mb-3">Contact Info</h6>
            <div className="text-muted">
              <div className="mb-2">
                <i className="bi bi-geo-alt me-2"></i>
                123 Commerce Street, Lagos, Nigeria
              </div>
              <div className="mb-2">
                <i className="bi bi-telephone me-2"></i>
                +234 800 123 4567
              </div>
              <div className="mb-2">
                <i className="bi bi-envelope me-2"></i>
                support@shopease.com
              </div>
              <div className="mb-3">
                <i className="bi bi-clock me-2"></i>
                Mon - Fri: 9AM - 6PM
              </div>
              <div className="d-flex align-items-center">
                <i className="bi bi-credit-card me-2"></i>
                <span className="me-2">Powered by</span>
                <strong className="text-primary">Moniepoint</strong>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4 border-secondary" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <p className="text-muted mb-0">
              &copy; {new Date().getFullYear()} ShopEase. All rights reserved.
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <a href="#" className="text-muted text-decoration-none me-3">Privacy Policy</a>
            <a href="#" className="text-muted text-decoration-none me-3">Terms of Service</a>
            <a href="#" className="text-muted text-decoration-none">Cookie Policy</a>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;