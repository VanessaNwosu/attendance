import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Carousel, ListGroup, Alert } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getListingById } from '../data/listings';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const ListingDetail = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = () => {
      const foundListing = getListingById(id);
      setListing(foundListing);
      setLoading(false);
    };

    fetchListing();
  }, [id]);

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

  const handleInquiry = () => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: { pathname: `/inquiry/${id}` } } });
    } else {
      navigate(`/inquiry/${id}`);
    }
  };

  const handlePayment = () => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: { pathname: `/payment/${id}` } } });
    } else {
      navigate(`/payment/${id}`);
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
            <p>The property you're looking for doesn't exist or may have been removed.</p>
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
                <li className="breadcrumb-item active">
                  {listing.title}
                </li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          {/* Image Gallery */}
          <Col lg={8} className="mb-4">
            <Card>
              <Carousel>
                {listing.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`${listing.title} - Image ${index + 1}`}
                      style={{ height: '400px', objectFit: 'cover' }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>
          </Col>

          {/* Property Details */}
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <Badge bg={getCategoryColor(listing.category)}>
                    {getCategoryLabel(listing.category)}
                  </Badge>
                  {!listing.available && (
                    <Badge bg="danger">Sold/Rented</Badge>
                  )}
                </div>

                <h3 className="text-primary fw-bold mb-3">
                  {formatPrice(listing.price, listing.category)}
                </h3>

                <h5 className="mb-2">{listing.title}</h5>
                <p className="text-muted mb-3">
                  <i className="bi bi-geo-alt"></i> {listing.location}
                </p>

                <Row className="mb-3">
                  <Col>
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-house display-6"></i>
                      <div className="fw-bold">{listing.bedrooms}</div>
                      <small className="text-muted">Bedrooms</small>
                    </div>
                  </Col>
                  <Col>
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-droplet display-6"></i>
                      <div className="fw-bold">{listing.bathrooms}</div>
                      <small className="text-muted">Bathrooms</small>
                    </div>
                  </Col>
                  <Col>
                    <div className="text-center p-2 border rounded">
                      <i className="bi bi-arrows-angle-expand display-6"></i>
                      <div className="fw-bold">{listing.sqft}</div>
                      <small className="text-muted">Sq Ft</small>
                    </div>
                  </Col>
                </Row>

                {listing.available ? (
                  <div className="d-grid gap-2">
                    <Button variant="primary" onClick={handleInquiry}>
                      <i className="bi bi-chat-dots me-2"></i>
                      Send Inquiry
                    </Button>
                    <Button variant="success" onClick={handlePayment}>
                      <i className="bi bi-credit-card me-2"></i>
                      Make Payment
                    </Button>
                  </div>
                ) : (
                  <Alert variant="secondary" className="text-center">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    This property is no longer available
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Property Information */}
        <Row className="mt-4">
          <Col lg={8}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Property Description</h5>
                <p>{listing.description}</p>

                <h5 className="mt-4 mb-3">Property Details</h5>
                <Row>
                  <Col md={6}>
                    <ListGroup variant="flush">
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Property Type:</span>
                        <span className="fw-bold">{listing.propertyType}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Year Built:</span>
                        <span className="fw-bold">{listing.yearBuilt}</span>
                      </ListGroup.Item>
                      <ListGroup.Item className="d-flex justify-content-between">
                        <span>Parking:</span>
                        <span className="fw-bold">{listing.parking}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </Col>
                  <Col md={6}>
                    <h6>Amenities</h6>
                    <ul className="list-unstyled">
                      {listing.amenities.map((amenity, index) => (
                        <li key={index}>
                          <i className="bi bi-check-circle text-success me-2"></i>
                          {amenity}
                        </li>
                      ))}
                    </ul>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Body>
                <h5 className="mb-3">Contact Agent</h5>
                <div className="text-center mb-3">
                  <i className="bi bi-person-circle display-4 text-primary"></i>
                  <h6 className="mt-2">{listing.agentName}</h6>
                </div>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" href={`tel:${listing.agentPhone}`}>
                    <i className="bi bi-telephone me-2"></i>
                    {listing.agentPhone}
                  </Button>
                  <Button variant="outline-primary" href={`mailto:${listing.agentEmail}`}>
                    <i className="bi bi-envelope me-2"></i>
                    Email Agent
                  </Button>
                </div>
                <small className="text-muted mt-2 d-block">
                  Listed on {new Date(listing.datePosted).toLocaleDateString()}
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ListingDetail;