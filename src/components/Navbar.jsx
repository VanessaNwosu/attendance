import React, { useState } from 'react';
import { Navbar, Nav, Container, Badge, Form, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';

const NavigationBar = () => {
  const { getCartCount } = useCart();
  const { searchProducts } = useProducts();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3">
          <i className="bi bi-shop me-2"></i>
          ShopEase
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className="fw-medium">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/products" className="fw-medium">
              Products
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="fw-medium">
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact" className="fw-medium">
              Contact
            </Nav.Link>
          </Nav>

          {/* Search Form */}
          <Form className="d-flex me-3" onSubmit={handleSearch}>
            <Form.Control
              type="search"
              placeholder="Search products..."
              className="me-2"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '250px' }}
            />
            <Button variant="outline-light" type="submit">
              <i className="bi bi-search"></i>
            </Button>
          </Form>

          <Nav className="align-items-center">
            {/* User Account Dropdown */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-light" id="user-dropdown" className="border-0">
                <i className="bi bi-person-circle fs-5"></i>
              </Dropdown.Toggle>
              <Dropdown.Menu align="end">
                <Dropdown.Item as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </Dropdown.Item>
                <Dropdown.Item as={Link} to="/register">
                  <i className="bi bi-person-plus me-2"></i>
                  Register
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <i className="bi bi-person me-2"></i>
                  My Account
                </Dropdown.Item>
                <Dropdown.Item>
                  <i className="bi bi-clock-history me-2"></i>
                  Order History
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Cart Link */}
            <Nav.Link as={Link} to="/cart" className="position-relative ms-3">
              <i className="bi bi-cart3 fs-4"></i>
              {getCartCount() > 0 && (
                <Badge 
                  bg="danger" 
                  pill 
                  className="position-absolute top-0 start-100 translate-middle"
                  style={{ fontSize: '0.75rem' }}
                >
                  {getCartCount()}
                </Badge>
              )}
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
