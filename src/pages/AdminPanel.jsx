import React, { useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { listings } from '../data/listings';
import Navbar from '../components/Navbar';

const AdminPanel = () => {
  const { currentUser, isLoggedIn, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  React.useEffect(() => {
    if (!isLoggedIn() || !isAdmin()) {
      navigate('/login');
    }
  }, [isLoggedIn, isAdmin, navigate]);

  const handleTogglePublished = (listingId) => {
    // In a real app, this would make an API call
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      listing.published = !listing.published;
      setMessage({
        type: 'success',
        text: `Listing ${listing.published ? 'published' : 'unpublished'} successfully!`
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const handleToggleAvailable = (listingId) => {
    // In a real app, this would make an API call
    const listing = listings.find(l => l.id === listingId);
    if (listing) {
      listing.available = !listing.available;
      setMessage({
        type: 'success',
        text: `Listing marked as ${listing.available ? 'available' : 'unavailable'}!`
      });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const formatPrice = (price, category) => {
    const formattedPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);

    if (category === 'rent') {
      return `${formattedPrice}/month`;
    }
    return formattedPrice;
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'sale': return 'success';
      case 'rent': return 'primary';
      case 'buy': return 'warning';
      default: return 'secondary';
    }
  };

  const getCategoryLabel = (category) => {
    switch (category) {
      case 'sale': return 'For Sale';
      case 'rent': return 'For Rent';
      case 'buy': return 'For Purchase';
      default: return category;
    }
  };

  if (!currentUser || !isAdmin()) {
    return null;
  }

  // Mock inquiries data
  const mockInquiries = [
    {
      id: 1,
      listingId: 1,
      listingTitle: "Modern 3-Bedroom Apartment",
      userName: "John Doe",
      userEmail: "john@example.com",
      subject: "Inquiry about: Modern 3-Bedroom Apartment",
      message: "I'm interested in viewing this property. When would be a good time?",
      date: "2024-01-20",
      status: "pending"
    },
    {
      id: 2,
      listingId: 2,
      listingTitle: "Cozy 2-Bedroom House for Rent",
      userName: "Jane Smith",
      userEmail: "jane@example.com",
      subject: "Rental inquiry",
      message: "Is this property still available for rent? I would like to schedule a viewing.",
      date: "2024-01-19",
      status: "responded"
    }
  ];

  return (
    <div>
      <Navbar />
      <Container className="py-4">
        <Row className="mb-4">
          <Col>
            <h2>
              <i className="bi bi-gear text-primary me-2"></i>
              Admin Panel
            </h2>
            <p className="text-muted">Manage listings, inquiries, and platform settings</p>
          </Col>
        </Row>

        {message.text && (
          <Alert variant={message.type} className="mb-4">
            {message.text}
          </Alert>
        )}

        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-house display-4 text-primary"></i>
                <h4>{listings.length}</h4>
                <p className="text-muted mb-0">Total Listings</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-eye display-4 text-success"></i>
                <h4>{listings.filter(l => l.published).length}</h4>
                <p className="text-muted mb-0">Published</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-check-circle display-4 text-info"></i>
                <h4>{listings.filter(l => l.available).length}</h4>
                <p className="text-muted mb-0">Available</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <i className="bi bi-chat-dots display-4 text-warning"></i>
                <h4>{mockInquiries.length}</h4>
                <p className="text-muted mb-0">Inquiries</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Listings Management */}
        <Card className="mb-4">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Manage Listings</h5>
            <Button variant="success" size="sm">
              <i className="bi bi-plus me-1"></i>
              Add New Listing
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Property</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map((listing) => (
                    <tr key={listing.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={listing.imageUrl}
                            alt={listing.title}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded me-3"
                          />
                          <div>
                            <h6 className="mb-1">{listing.title}</h6>
                            <small className="text-muted">{listing.location}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg={getCategoryColor(listing.category)}>
                          {getCategoryLabel(listing.category)}
                        </Badge>
                      </td>
                      <td className="fw-bold">
                        {formatPrice(listing.price, listing.category)}
                      </td>
                      <td>
                        <div>
                          <Badge bg={listing.published ? 'success' : 'secondary'} className="me-1">
                            {listing.published ? 'Published' : 'Draft'}
                          </Badge>
                          <Badge bg={listing.available ? 'primary' : 'danger'}>
                            {listing.available ? 'Available' : 'Sold/Rented'}
                          </Badge>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button
                            variant={listing.published ? 'outline-warning' : 'outline-success'}
                            onClick={() => handleTogglePublished(listing.id)}
                            title={listing.published ? 'Unpublish' : 'Publish'}
                          >
                            <i className={`bi bi-${listing.published ? 'eye-slash' : 'eye'}`}></i>
                          </Button>
                          <Button
                            variant={listing.available ? 'outline-danger' : 'outline-primary'}
                            onClick={() => handleToggleAvailable(listing.id)}
                            title={listing.available ? 'Mark as Sold/Rented' : 'Mark as Available'}
                          >
                            <i className={`bi bi-${listing.available ? 'x-circle' : 'check-circle'}`}></i>
                          </Button>
                          <Button
                            variant="outline-primary"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowEditModal(true);
                            }}
                            title="Edit"
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Inquiries Management */}
        <Card>
          <Card.Header>
            <h5 className="mb-0">Recent Inquiries</h5>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>User</th>
                    <th>Property</th>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {mockInquiries.map((inquiry) => (
                    <tr key={inquiry.id}>
                      <td>
                        <div>
                          <h6 className="mb-1">{inquiry.userName}</h6>
                          <small className="text-muted">{inquiry.userEmail}</small>
                        </div>
                      </td>
                      <td>{inquiry.listingTitle}</td>
                      <td>{inquiry.subject}</td>
                      <td>{new Date(inquiry.date).toLocaleDateString()}</td>
                      <td>
                        <Badge bg={inquiry.status === 'pending' ? 'warning' : 'success'}>
                          {inquiry.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="btn-group btn-group-sm">
                          <Button variant="outline-primary" title="View Details">
                            <i className="bi bi-eye"></i>
                          </Button>
                          <Button variant="outline-success" title="Respond">
                            <i className="bi bi-reply"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          </Card.Body>
        </Card>

        {/* Edit Listing Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Listing</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedListing && (
              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Title</Form.Label>
                      <Form.Control type="text" defaultValue={selectedListing.title} />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" defaultValue={selectedListing.price} />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control as="textarea" rows={3} defaultValue={selectedListing.description} />
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Select defaultValue={selectedListing.category}>
                        <option value="sale">For Sale</option>
                        <option value="rent">For Rent</option>
                        <option value="buy">For Purchase</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bedrooms</Form.Label>
                      <Form.Control type="number" defaultValue={selectedListing.bedrooms} />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>Bathrooms</Form.Label>
                      <Form.Control type="number" defaultValue={selectedListing.bathrooms} />
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="primary">
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default AdminPanel;