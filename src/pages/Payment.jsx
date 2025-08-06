import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getListingById } from '../data/listings';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Payment = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    billingAddress: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'full'
  });

  const { currentUser, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login', { state: { from: { pathname: `/payment/${id}` } } });
      return;
    }

    const fetchListing = () => {
      const foundListing = getListingById(id);
      setListing(foundListing);
      setLoading(false);
    };

    fetchListing();
  }, [id, isLoggedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const getPaymentAmount = () => {
    if (!listing) return 0;
    
    switch (formData.paymentMethod) {
      case 'full':
        return listing.price;
      case 'deposit':
        return listing.category === 'rent' 
          ? listing.price * 2 // First month + security deposit
          : listing.price * 0.1; // 10% down payment for purchase/sale
      default:
        return listing.price;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const processPayment = async () => {
    setProcessing(true);
    setShowConfirmModal(false);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // In a real app, this would make an API call to process payment
      const paymentData = {
        listingId: listing.id,
        listingTitle: listing.title,
        userId: currentUser.id,
        amount: getPaymentAmount(),
        paymentMethod: formData.paymentMethod,
        cardLast4: formData.cardNumber.slice(-4),
        dateProcessed: new Date().toISOString(),
        status: 'completed'
      };

      console.log('Payment processed:', paymentData);
      
      // Mark listing as unavailable (in a real app, this would be an API call)
      listing.available = false;
      
      setPaymentComplete(true);

    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setProcessing(false);
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
            <p>The property you're trying to purchase doesn't exist.</p>
            <Button as={Link} to="/" variant="primary">
              Back to Home
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (!listing.available) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <Alert variant="info">
            <h4>Property No Longer Available</h4>
            <p>This property has already been sold or rented.</p>
            <Button as={Link} to="/" variant="primary">
              Browse Other Properties
            </Button>
          </Alert>
        </Container>
      </div>
    );
  }

  if (paymentComplete) {
    return (
      <div>
        <Navbar />
        <Container className="py-5">
          <Row className="justify-content-center">
            <Col md={8}>
              <Card className="text-center">
                <Card.Body className="p-5">
                  <i className="bi bi-check-circle display-1 text-success"></i>
                  <h2 className="text-success mt-3">Payment Successful!</h2>
                  <p className="lead">
                    Congratulations! Your payment for <strong>{listing.title}</strong> has been processed successfully.
                  </p>
                  <p className="text-muted">
                    Amount Paid: <strong>{formatPrice(getPaymentAmount(), listing.category)}</strong>
                  </p>
                  <hr />
                  <p>
                    You will receive a confirmation email shortly. Our team will contact you within 24 hours 
                    to arrange the next steps.
                  </p>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                    <Button as={Link} to="/dashboard" variant="primary">
                      Go to Dashboard
                    </Button>
                    <Button as={Link} to="/" variant="outline-primary">
                      Browse More Properties
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
                <li className="breadcrumb-item active">Payment</li>
              </ol>
            </nav>
          </Col>
        </Row>

        <Row>
          {/* Payment Summary */}
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
                
                <hr />
                
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Property Price:</span>
                    <span className="fw-bold">{formatPrice(listing.price, listing.category)}</span>
                  </div>
                  
                  {formData.paymentMethod === 'deposit' && (
                    <div className="d-flex justify-content-between mb-2">
                      <span>
                        {listing.category === 'rent' ? 'Deposit Amount:' : 'Down Payment (10%):'}
                      </span>
                      <span className="fw-bold text-primary">
                        {formatPrice(getPaymentAmount(), listing.category)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="bg-light p-3 rounded">
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total Amount:</span>
                    <span className="fw-bold text-success fs-5">
                      {formatPrice(getPaymentAmount(), listing.category)}
                    </span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Payment Form */}
          <Col lg={8}>
            <Card>
              <Card.Body>
                <h3><i className="bi bi-credit-card text-primary me-2"></i>Payment Details</h3>
                <p className="text-muted mb-4">
                  Complete your payment to secure this property.
                </p>

                <Form onSubmit={handleSubmit}>
                  {/* Payment Method */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Payment Method</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group>
                        <div className="d-flex gap-3">
                          <Form.Check
                            type="radio"
                            id="full-payment"
                            name="paymentMethod"
                            value="full"
                            checked={formData.paymentMethod === 'full'}
                            onChange={handleChange}
                            label={`Full Payment (${formatPrice(listing.price, listing.category)})`}
                          />
                          <Form.Check
                            type="radio"
                            id="deposit-payment"
                            name="paymentMethod"
                            value="deposit"
                            checked={formData.paymentMethod === 'deposit'}
                            onChange={handleChange}
                            label={
                              listing.category === 'rent' 
                                ? 'Deposit (2 months)' 
                                : 'Down Payment (10%)'
                            }
                          />
                        </div>
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  {/* Card Information */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Card Information</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Card Number</Form.Label>
                            <Form.Control
                              type="text"
                              name="cardNumber"
                              value={formData.cardNumber}
                              onChange={handleChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              value={formData.expiryDate}
                              onChange={handleChange}
                              placeholder="MM/YY"
                              maxLength="5"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              value={formData.cvv}
                              onChange={handleChange}
                              placeholder="123"
                              maxLength="4"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      
                      <Form.Group className="mb-3">
                        <Form.Label>Cardholder Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardName"
                          value={formData.cardName}
                          onChange={handleChange}
                          placeholder="Name on card"
                          required
                        />
                      </Form.Group>
                    </Card.Body>
                  </Card>

                  {/* Billing Address */}
                  <Card className="mb-4">
                    <Card.Header>
                      <h5 className="mb-0">Billing Address</h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Street Address</Form.Label>
                        <Form.Control
                          type="text"
                          name="billingAddress"
                          value={formData.billingAddress}
                          onChange={handleChange}
                          placeholder="123 Main Street"
                          required
                        />
                      </Form.Group>
                      
                      <Row>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>City</Form.Label>
                            <Form.Control
                              type="text"
                              name="city"
                              value={formData.city}
                              onChange={handleChange}
                              placeholder="City"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>State</Form.Label>
                            <Form.Control
                              type="text"
                              name="state"
                              value={formData.state}
                              onChange={handleChange}
                              placeholder="State"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group className="mb-3">
                            <Form.Label>ZIP Code</Form.Label>
                            <Form.Control
                              type="text"
                              name="zipCode"
                              value={formData.zipCode}
                              onChange={handleChange}
                              placeholder="12345"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

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
                      variant="success"
                      size="lg"
                      disabled={processing}
                    >
                      <i className="bi bi-shield-check me-2"></i>
                      Pay {formatPrice(getPaymentAmount(), listing.category)}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Confirmation Modal */}
        <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Payment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              You are about to pay <strong>{formatPrice(getPaymentAmount(), listing.category)}</strong> 
              for <strong>{listing.title}</strong>.
            </p>
            <p className="text-muted">
              This payment is secure and will mark the property as unavailable to other buyers.
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" onClick={() => setShowConfirmModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={processPayment} disabled={processing}>
              {processing ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Processing...
                </>
              ) : (
                'Confirm Payment'
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </div>
  );
};

export default Payment;