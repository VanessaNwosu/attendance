import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById } from '../data/listings';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Inquiry = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    phoneNumber: '',
    preferredContact: 'email',
    inquiryType: 'general'
  });

  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: { pathname: `/inquiry/${id}` } } });
      return;
    }

    const fetchListing = () => {
      const foundListing = getListingById(id);
      setListing(foundListing);
      setLoading(false);

      if (foundListing) {
        setFormData(prev => ({
          ...prev,
          subject: `Inquiry about: ${foundListing.title}`,
          phoneNumber: currentUser.phone || ''
        }));
      }
    };

    fetchListing();
  }, [id, isLoggedIn, navigate, currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      // Simulate sending inquiry
      await new Promise(resolve => setTimeout(resolve, 2000));

      // In a real app, this would make an API call to save the inquiry
      const inquiryData = {
        listingId: listing.id,
        listingTitle: listing.title,
        userId: currentUser.id,
        userName: `${currentUser.firstName} ${currentUser.lastName}`,
        userEmail: currentUser.email,
        userPhone: formData.phoneNumber,
        subject: formData.subject,
        message: formData.message,
        inquiryType: formData.inquiryType,
        preferredContact: formData.preferredContact,
        dateSubmitted: new Date().toISOString(),
        status: 'pending'
      };

      console.log('Inquiry submitted:', inquiryData);
      
      setMessage({ 
        type: 'success', 
        text: 'Your inquiry has been submitted successfully! An admin will contact you soon.' 
      });

      // Reset form
      setFormData({
        subject: `Inquiry about: ${listing.title}`,
        message: '',
        phoneNumber: currentUser.phone || '',
        preferredContact: 'email',
        inquiryType: 'general'
      });

    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: 'Failed to submit inquiry. Please try again.' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

  if (!listing) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <Alert variant="warning">
            <h4>Property Not Found</h4>
            <p>The property you're trying to inquire about doesn't exist.</p>
            <Button as={Link} to="/" variant="primary">
              Back to Home
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Container className="py-4">
        {/* Breadcrumb */}
        <Row className="mb-3">
          <Col>
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link to="/">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to={`/listing/${listing.id}`}>{listing.title}</Link>
                </li>
                <li className="breadcrumb-item active">Inquiry</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          {/* Property Summary */}
          <Col lg={4} className="mb-4">
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Img 
                variant="top" 
                src={listing.imageUrl} 
                style={{ height: '200px', objectFit: 'cover' }} 
              />
              <Card.Body>
                <Card.Title className="h5">{listing.title}</Card.Title>
                <Card.Text className="text-muted mb-2">
                  <i className="bi bi-geo-alt"></i> {listing.location}
                </Card.Text>
                <div className="d-flex justify-content-between mb-3">
                  <span className="fw-bold text-primary">
                    ${listing.price.toLocaleString()}
                    {listing.category === 'rent' && '/month'}
                  </span>
                  <span className="text-muted">{listing.propertyType}</span>
                </div>
                
                <div className="text-center">
                  <h6>Contact Agent</h6>
                  <p className="mb-1 fw-bold">{listing.agentName}</p>
                  <p className="text-muted small mb-0">{listing.agentEmail}</p>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Inquiry Form */}
          <Col lg={8}>
            <Card>
              <Card.Body>
                <div className="mb-4">
                  <h3><i className="bi bi-chat-dots text-primary me-2"></i>Send Inquiry</h3>
                  <p className="text-muted">
                    Fill out the form below to send an inquiry about this property. 
                    An admin will contact you within 24 hours.
                  </p>
                </div>

                {message.text && (
                  <Alert variant={message.type} className="mb-4">
                    {message.text}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Name</Form.Label>
                        <Form.Control
                          type="text"
                          value={`${currentUser.firstName} ${currentUser.lastName}`}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Your Email</Form.Label>
                        <Form.Control
                          type="email"
                          value={currentUser.email}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter your phone number"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Preferred Contact Method</Form.Label>
                        <Form.Select 
                          name="preferredContact" 
                          value={formData.preferredContact}
                          onChange={handleChange}
                        >
                          <option value="email">Email</option>
                          <option value="phone">Phone</option>
                          <option value="both">Both</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Inquiry Type</Form.Label>
                        <Form.Select 
                          name="inquiryType" 
                          value={formData.inquiryType}
                          onChange={handleChange}
                        >
                          <option value="general">General Information</option>
                          <option value="viewing">Schedule Viewing</option>
                          <option value="financing">Financing Options</option>
                          <option value="negotiation">Price Negotiation</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="Enter subject"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label>Message</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={6}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please provide details about your inquiry..."
                      required
                    />
                    <Form.Text className="text-muted">
                      Please include any specific questions or requirements you have about this property.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <Button 
                      variant="outline-secondary" 
                      as={Link} 
                      to={`/listing/${listing.id}`}
                    >
                      Back to Listing
                    </Button>
                    <Button 
                      type="submit" 
                      variant="primary"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send me-2"></i>
                          Send Inquiry
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Inquiry;