import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Checkout = () => {
  const { cartItems, getCartTotal, getCartCount, clearCart } = useCart();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'moniepoint'
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 1500;
  const total = subtotal + shipping;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'ZIP code is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    const phoneRegex = /^[0-9+\-\s()]+$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowPaymentModal(true);
    }
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      // Simulate Moniepoint payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success', { 
        state: { 
          orderData: {
            orderId: 'ORD-' + Date.now(),
            total,
            items: cartItems.length,
            customerInfo: formData
          }
        }
      });
    } catch (error) {
      console.error('Payment failed:', error);
      setIsProcessing(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>Your cart is empty</h4>
          <p>Please add some items to your cart before proceeding to checkout.</p>
          <Button variant="primary" onClick={() => navigate('/products')}>
            Continue Shopping
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <h2 className="mb-4">Checkout</h2>
        </Col>
      </Row>

      <Form onSubmit={handleSubmit}>
        <Row>
          {/* Checkout Form */}
          <Col lg={8}>
            {/* Customer Information */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-person me-2"></i>
                  Customer Information
                </h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>First Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.firstName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.firstName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Last Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        isInvalid={!!errors.lastName}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.lastName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number *</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+234 800 123 4567"
                        isInvalid={!!errors.phone}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Shipping Address */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-truck me-2"></i>
                  Shipping Address
                </h5>
              </Card.Header>
              <Card.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Street Address *</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main Street, Apartment 4B"
                    isInvalid={!!errors.address}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
                <Row>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>City *</Form.Label>
                      <Form.Control
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        isInvalid={!!errors.city}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.city}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>State *</Form.Label>
                      <Form.Select
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        isInvalid={!!errors.state}
                      >
                        <option value="">Select State</option>
                        <option value="lagos">Lagos</option>
                        <option value="abuja">Abuja</option>
                        <option value="kano">Kano</option>
                        <option value="rivers">Rivers</option>
                        <option value="ogun">Ogun</option>
                        <option value="kaduna">Kaduna</option>
                        <option value="oyo">Oyo</option>
                        <option value="delta">Delta</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.state}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-3">
                      <Form.Label>ZIP Code *</Form.Label>
                      <Form.Control
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        placeholder="100001"
                        isInvalid={!!errors.zipCode}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.zipCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Payment Method */}
            <Card className="mb-4">
              <Card.Header>
                <h5 className="mb-0">
                  <i className="bi bi-credit-card me-2"></i>
                  Payment Method
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex align-items-center p-3 border rounded bg-light">
                  <Form.Check
                    type="radio"
                    name="paymentMethod"
                    id="moniepoint"
                    value="moniepoint"
                    checked={formData.paymentMethod === 'moniepoint'}
                    onChange={handleInputChange}
                    className="me-3"
                  />
                  <div>
                    <div className="d-flex align-items-center">
                      <i className="bi bi-shield-check text-success me-2 fs-4"></i>
                      <div>
                        <strong>Moniepoint Secure Payment</strong>
                        <p className="text-muted mb-0 small">
                          Pay securely with bank transfer, card, or mobile money
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Order Summary */}
          <Col lg={4}>
            <Card className="sticky-top" style={{ top: '20px' }}>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {/* Order Items */}
                <div className="mb-3">
                  <h6>Items ({getCartCount()})</h6>
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {cartItems.map(item => (
                      <div key={item.id} className="d-flex justify-content-between align-items-center mb-2">
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                            className="rounded me-2"
                          />
                          <div>
                            <small className="fw-bold">{item.name}</small>
                            <br />
                            <small className="text-muted">Qty: {item.quantity}</small>
                          </div>
                        </div>
                        <small className="fw-bold">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </div>
                </div>

                <hr />

                {/* Pricing Breakdown */}
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal:</span>
                  <strong>₦{subtotal.toLocaleString()}</strong>
                </div>
                
                <div className="d-flex justify-content-between mb-3">
                  <span>Shipping:</span>
                  <span>
                    {shipping === 0 ? (
                      <span className="text-success"><strong>FREE</strong></span>
                    ) : (
                      <strong>₦{shipping.toLocaleString()}</strong>
                    )}
                  </span>
                </div>

                <hr />
                
                <div className="d-flex justify-content-between mb-4">
                  <h5>Total:</h5>
                  <h5 className="text-primary">₦{total.toLocaleString()}</h5>
                </div>

                <div className="d-grid">
                  <Button 
                    type="submit" 
                    variant="primary" 
                    size="lg"
                  >
                    <i className="bi bi-shield-check me-2"></i>
                    Place Order
                  </Button>
                </div>

                <div className="text-center mt-3">
                  <small className="text-muted">
                    <i className="bi bi-lock me-1"></i>
                    Your payment info is secured with 256-bit SSL encryption
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>

      {/* Payment Processing Modal */}
      <Modal 
        show={showPaymentModal} 
        backdrop="static" 
        keyboard={false}
        centered
      >
        <Modal.Body className="text-center py-5">
          {!isProcessing ? (
            <>
              <div className="mb-4">
                <i className="bi bi-shield-check text-success" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="mb-3">Confirm Your Payment</h4>
              <p className="text-muted mb-4">
                You will be redirected to Moniepoint's secure payment gateway to complete your order.
              </p>
              <p className="fw-bold fs-4 text-primary mb-4">
                Total: ₦{total.toLocaleString()}
              </p>
              <div className="d-grid gap-2">
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={processPayment}
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Pay with Moniepoint
                </Button>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <div className="spinner-border text-primary" style={{ width: '4rem', height: '4rem' }}>
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
              <h4 className="mb-3">Processing Payment...</h4>
              <p className="text-muted">
                Please wait while we process your payment securely through Moniepoint.
              </p>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Checkout;