import React from 'react';
import { Navbar as BsNavbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <BsNavbar expand="lg" bg="white" className="shadow-sm">
      <Container>
        <BsNavbar.Brand as={Link} to="/" className="fw-bold text-primary fs-3">
          <i className="bi bi-house-door me-2"></i>
          RealEstate Pro
        </BsNavbar.Brand>
        
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-1"></i>
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/listings">
              <i className="bi bi-grid me-1"></i>
              All Listings
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <i className="bi bi-info-circle me-1"></i>
              About
            </Nav.Link>
            <Nav.Link as={Link} to="/contact">
              <i className="bi bi-telephone me-1"></i>
              Contact
            </Nav.Link>
          </Nav>
          
          <Nav>
            {isLoggedIn() ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser.firstName} {currentUser.lastName}
                  </span>
                } 
                id="user-nav-dropdown"
              >
                <NavDropdown.Item as={Link} to="/dashboard">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/my-inquiries">
                  <i className="bi bi-chat-dots me-2"></i>
                  My Inquiries
                </NavDropdown.Item>
                {currentUser.role === 'admin' && (
                  <>
                    <NavDropdown.Divider />
                    <NavDropdown.Item as={Link} to="/admin">
                      <i className="bi bi-gear me-2"></i>
                      Admin Panel
                    </NavDropdown.Item>
                  </>
                )}
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
