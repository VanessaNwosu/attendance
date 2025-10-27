import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';

const OrderSuccess = () => {
  const location = useLocation();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <h4>No order information found</h4>
          <p>Please start a new order.</p>
          <Button as={Link} to="/products" variant="primary">
            Continue Shopping
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <div className="text-center mb-5">
            <div className="mb-4">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '5rem' }}></i>
            </div>
            <h1 className="text-success mb-3">Order Confirmed!</h1>
            <p className="lead text-muted mb-4">
              Thank you for your purchase. Your order has been successfully placed and is being processed.
            </p>
          </div>

          {/* Order Details Card */}
          <Card className="mb-4">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-receipt me-2"></i>
                Order Details
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="fw-bold">Order Information</h6>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Order ID:</td>
                        <td className="text-primary">{orderData.orderId}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date:</td>
                        <td>{new Date().toLocaleDateString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Items:</td>
                        <td>{orderData.items} item(s)</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Total:</td>
                        <td className="text-success fs-5">₦{orderData.total.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="fw-bold">Shipping Information</h6>
                  <div className="text-muted">
                    <div>{orderData.customerInfo.firstName} {orderData.customerInfo.lastName}</div>
                    <div>{orderData.customerInfo.address}</div>
                    <div>{orderData.customerInfo.city}, {orderData.customerInfo.state} {orderData.customerInfo.zipCode}</div>
                    <div className="mt-2">
                      <strong>Email:</strong> {orderData.customerInfo.email}
                    </div>
                    <div>
                      <strong>Phone:</strong> {orderData.customerInfo.phone}
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* What's Next Card */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                What's Next?
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex align-items-start mb-3">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                  1
                </div>
                <div>
                  <strong>Order Confirmation</strong>
                  <p className="text-muted mb-0">You'll receive an email confirmation shortly with your order details.</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                  2
                </div>
                <div>
                  <strong>Processing</strong>
                  <p className="text-muted mb-0">We'll prepare your order for shipment within 1-2 business days.</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start mb-3">
                <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                  3
                </div>
                <div>
                  <strong>Shipping</strong>
                  <p className="text-muted mb-0">Your order will be shipped and you'll receive tracking information.</p>
                </div>
              </div>
              
              <div className="d-flex align-items-start">
                <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                     style={{ width: '30px', height: '30px', fontSize: '0.8rem' }}>
                  4
                </div>
                <div>
                  <strong>Delivery</strong>
                  <p className="text-muted mb-0">Expect delivery within 2-5 business days.</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Payment Information */}
          <Alert variant="success" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-shield-check fs-4 me-3"></i>
              <div>
                <strong>Payment Secured by Moniepoint</strong>
                <p className="mb-0">Your payment was processed securely. You will receive a payment confirmation shortly.</p>
              </div>
            </div>
          </Alert>

          {/* Action Buttons */}
          <div className="d-grid gap-2 d-md-flex justify-content-md-center">
            <Button as={Link} to="/products" variant="primary" size="lg" className="me-md-2">
              <i className="bi bi-bag me-2"></i>
              Continue Shopping
            </Button>
            <Button variant="outline-primary" size="lg" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>
              Print Receipt
            </Button>
          </div>

          {/* Contact Information */}
          <Card className="mt-4">
            <Card.Body className="text-center">
              <h6>Need Help?</h6>
              <p className="text-muted mb-0">
                If you have any questions about your order, please contact us at{' '}
                <a href="mailto:support@shopease.com" className="text-decoration-none">
                  support@shopease.com
                </a>{' '}
                or call{' '}
                <a href="tel:+2348001234567" className="text-decoration-none">
                  +234 800 123 4567
                </a>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderSuccess;