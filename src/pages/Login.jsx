import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showAlert, setShowAlert] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Simulate login
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card>
            <Card.Header className="text-center bg-primary text-white">
              <h4 className="mb-0">
                <i className="bi bi-person-circle me-2"></i>
                Login to Your Account
              </h4>
            </Card.Header>
            <Card.Body className="p-4">
              {showAlert && (
                <Alert variant="success" className="mb-4">
                  <i className="bi bi-check-circle me-2"></i>
                  Login successful! Welcome back.
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    isInvalid={!!errors.email}
                    placeholder="Enter your email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    isInvalid={!!errors.password}
                    placeholder="Enter your password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check 
                    type="checkbox" 
                    label="Remember me" 
                    id="rememberMe"
                  />
                  <Link to="#" className="text-decoration-none">
                    Forgot password?
                  </Link>
                </div>

                <div className="d-grid">
                  <Button type="submit" variant="primary" size="lg">
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Sign In
                  </Button>
                </div>
              </Form>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted mb-3">Or sign in with</p>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary">
                    <i className="bi bi-google me-2"></i>
                    Continue with Google
                  </Button>
                  <Button variant="outline-dark">
                    <i className="bi bi-facebook me-2"></i>
                    Continue with Facebook
                  </Button>
                </div>
              </div>

              <hr className="my-4" />

              <div className="text-center">
                <p className="text-muted">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-decoration-none fw-bold">
                    Sign up here
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Security Notice */}
          <Card className="mt-4">
            <Card.Body className="text-center">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-shield-check text-success me-2"></i>
                <strong>Secure Login</strong>
              </div>
              <small className="text-muted">
                Your login is protected with SSL encryption and secured by Moniepoint.
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;