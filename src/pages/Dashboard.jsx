import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Tab, Tabs } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { currentUser, updateUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    firstName: currentUser?.firstName || '',
    lastName: currentUser?.lastName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || ''
  });

  React.useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login');
    }
  }, [isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const result = await updateUser(formData);
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: 'Profile updated successfully!' 
        });
      } else {
        setMessage({ 
          type: 'danger', 
          text: result.error || 'Failed to update profile' 
        });
      }
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: 'An error occurred while updating your profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>
              <i className="bi bi-speedometer2 text-primary me-2"></i>
              Dashboard
            </h2>
            <p className="text-muted">Welcome back, {currentUser.firstName}!</p>
          </Col>
        </Row>

        <Tabs defaultActiveKey="profile" className="mb-4">
          <Tab eventKey="profile" title={<><i className="bi bi-person me-2"></i>Profile</>}>
            <Row>
              <Col lg={8}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Profile Information</h5>
                  </Card.Header>
                  <Card.Body>
                    {message.text && (
                      <Alert variant={message.type} className="mb-4">
                        {message.text}
                      </Alert>
                    )}

                    <Form onSubmit={handleSubmit}>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleChange}
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </Form.Group>

                      <Button 
                        type="submit" 
                        variant="primary"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update Profile'}
                      </Button>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <Card.Header>
                    <h5 className="mb-0">Account Details</h5>
                  </Card.Header>
                  <Card.Body>
                    <div className="text-center mb-3">
                      <i className="bi bi-person-circle display-4 text-primary"></i>
                      <h6 className="mt-2">{currentUser.firstName} {currentUser.lastName}</h6>
                      <small className="text-muted">{currentUser.role}</small>
                    </div>
                    
                    <div className="border-top pt-3">
                      <p className="mb-2">
                        <strong>Email:</strong><br />
                        <span className="text-muted">{currentUser.email}</span>
                      </p>
                      <p className="mb-2">
                        <strong>Phone:</strong><br />
                        <span className="text-muted">{currentUser.phone || 'Not provided'}</span>
                      </p>
                      <p className="mb-0">
                        <strong>Member Since:</strong><br />
                        <span className="text-muted">January 2024</span>
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="activity" title={<><i className="bi bi-activity me-2"></i>Activity</>}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Recent Activity</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <i className="bi bi-clock-history display-4 text-muted"></i>
                  <h5 className="mt-3 text-muted">No Recent Activity</h5>
                  <p className="text-muted">Your recent inquiries and property interactions will appear here.</p>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          <Tab eventKey="inquiries" title={<><i className="bi bi-chat-dots me-2"></i>My Inquiries</>}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Property Inquiries</h5>
              </Card.Header>
              <Card.Body>
                <div className="text-center py-5">
                  <i className="bi bi-envelope display-4 text-muted"></i>
                  <h5 className="mt-3 text-muted">No Inquiries Yet</h5>
                  <p className="text-muted">Inquiries you send about properties will be displayed here.</p>
                  <Button variant="primary" href="/">
                    Browse Properties
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Tab>

          {currentUser.role === 'admin' && (
            <Tab eventKey="admin" title={<><i className="bi bi-gear me-2"></i>Admin</>}>
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Admin Panel</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <i className="bi bi-house display-4 text-primary"></i>
                          <h5 className="mt-3">Manage Listings</h5>
                          <p className="text-muted">Add, edit, or remove property listings</p>
                          <Button variant="outline-primary">
                            Manage Properties
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <i className="bi bi-chat-dots display-4 text-success"></i>
                          <h5 className="mt-3">View Inquiries</h5>
                          <p className="text-muted">Respond to customer inquiries</p>
                          <Button variant="outline-success">
                            View Inquiries
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <i className="bi bi-people display-4 text-warning"></i>
                          <h5 className="mt-3">User Management</h5>
                          <p className="text-muted">Manage user accounts and roles</p>
                          <Button variant="outline-warning">
                            Manage Users
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                      <Card className="h-100">
                        <Card.Body className="text-center">
                          <i className="bi bi-graph-up display-4 text-info"></i>
                          <h5 className="mt-3">Analytics</h5>
                          <p className="text-muted">View platform statistics</p>
                          <Button variant="outline-info">
                            View Analytics
                          </Button>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          )}
        </Tabs>
      </Container>
    </div>
  );
};

export default Dashboard;