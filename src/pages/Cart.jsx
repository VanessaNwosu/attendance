import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    clearCart, 
    getCartTotal, 
    getCartCount 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity === 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, newQuantity);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 10000 ? 0 : 1500; // Free shipping over ₦10,000
  const total = subtotal + shipping;

  if (cartItems.length === 0) {
    return (
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <i className="bi bi-cart-x display-1 text-muted"></i>
            <h2 className="mt-3">Your cart is empty</h2>
            <p className="text-muted mb-4">
              Looks like you haven't added anything to your cart yet.
            </p>
            <Button as={Link} to="/products" variant="primary" size="lg">
              Start Shopping
            </Button>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>
              Shopping Cart 
              <Badge bg="primary" className="ms-2">{getCartCount()} items</Badge>
            </h2>
            <Button 
              variant="outline-danger" 
              onClick={clearCart}
              className="d-flex align-items-center"
            >
              <i className="bi bi-trash me-2"></i>
              Clear Cart
            </Button>
          </div>
        </Col>
      </Row>

      <Row>
        {/* Cart Items */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Cart Items</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="bg-light">
                  <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <img 
                            src={item.image} 
                            alt={item.name}
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }}
                            className="rounded me-3"
                          />
                          <div>
                            <h6 className="mb-1">
                              <Link 
                                to={`/product/${item.id}`} 
                                className="text-decoration-none"
                              >
                                {item.name}
                              </Link>
                            </h6>
                            <small className="text-muted">{item.category}</small>
                          </div>
                        </div>
                      </td>
                      <td className="align-middle">
                        <strong>₦{item.price.toLocaleString()}</strong>
                      </td>
                      <td className="align-middle">
                        <div className="d-flex align-items-center">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          >
                            <i className="bi bi-dash"></i>
                          </Button>
                          <span className="mx-3 fw-bold">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          >
                            <i className="bi bi-plus"></i>
                          </Button>
                        </div>
                      </td>
                      <td className="align-middle">
                        <strong className="text-primary">
                          ₦{(item.price * item.quantity).toLocaleString()}
                        </strong>
                      </td>
                      <td className="align-middle">
                        <Button 
                          variant="outline-danger" 
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Continue Shopping */}
          <Button as={Link} to="/products" variant="outline-primary">
            <i className="bi bi-arrow-left me-2"></i>
            Continue Shopping
          </Button>
        </Col>

        {/* Order Summary */}
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Order Summary</h5>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <span>Subtotal ({getCartCount()} items):</span>
                <strong>₦{subtotal.toLocaleString()}</strong>
              </div>
              
              <div className="d-flex justify-content-between mb-3">
                <span>Shipping:</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-success">
                      <strong>FREE</strong>
                    </span>
                  ) : (
                    <strong>₦{shipping.toLocaleString()}</strong>
                  )}
                </span>
              </div>

              {shipping === 0 && (
                <Alert variant="success" className="py-2 px-3 mb-3">
                  <small>
                    <i className="bi bi-check-circle me-1"></i>
                    You qualify for free shipping!
                  </small>
                </Alert>
              )}

              {shipping > 0 && (
                <Alert variant="info" className="py-2 px-3 mb-3">
                  <small>
                    Add ₦{(10000 - subtotal).toLocaleString()} more to qualify for free shipping
                  </small>
                </Alert>
              )}

              <hr />
              
              <div className="d-flex justify-content-between mb-4">
                <h5>Total:</h5>
                <h5 className="text-primary">₦{total.toLocaleString()}</h5>
              </div>

              <div className="d-grid">
                <Button 
                  as={Link} 
                  to="/checkout" 
                  variant="primary" 
                  size="lg"
                  className="mb-3"
                >
                  <i className="bi bi-credit-card me-2"></i>
                  Proceed to Checkout
                </Button>
              </div>

              {/* Payment Security */}
              <div className="text-center mt-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check text-success me-1"></i>
                  Secure checkout powered by <strong>Moniepoint</strong>
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Trust Indicators */}
          <Card>
            <Card.Header>
              <h6 className="mb-0">Why Shop With Us?</h6>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <i className="bi bi-truck text-primary me-2"></i>
                <small>Fast & reliable delivery</small>
              </div>
              <div className="mb-3">
                <i className="bi bi-shield-check text-success me-2"></i>
                <small>Secure payment protection</small>
              </div>
              <div className="mb-3">
                <i className="bi bi-arrow-clockwise text-warning me-2"></i>
                <small>30-day return policy</small>
              </div>
              <div>
                <i className="bi bi-headset text-info me-2"></i>
                <small>24/7 customer support</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;