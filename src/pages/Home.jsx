import React from 'react';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Home = () => {
  const { featuredProducts } = useProducts();
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div>
      {/* Hero Carousel */}
      <Carousel className="mb-5">
        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{
              height: '500px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                  <h1 className="display-4 fw-bold mb-4">
                    Discover Amazing Products
                  </h1>
                  <p className="lead mb-4">
                    Shop the latest trends and find everything you need with fast, 
                    secure checkout powered by Moniepoint.
                  </p>
                  <Button as={Link} to="/products" variant="light" size="lg" className="me-3">
                    Shop Now
                  </Button>
                  <Button as={Link} to="/about" variant="outline-light" size="lg">
                    Learn More
                  </Button>
                </Col>
                <Col md={6} className="text-center">
                  <i className="bi bi-bag-check" style={{ fontSize: '15rem', opacity: 0.3 }}></i>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
        
        <Carousel.Item>
          <div 
            className="d-flex align-items-center justify-content-center"
            style={{
              height: '500px',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white'
            }}
          >
            <Container>
              <Row className="align-items-center">
                <Col md={6}>
                  <h1 className="display-4 fw-bold mb-4">
                    Secure Payments
                  </h1>
                  <p className="lead mb-4">
                    Pay with confidence using Moniepoint's secure payment system. 
                    Fast, reliable, and protected transactions.
                  </p>
                  <Button as={Link} to="/products" variant="light" size="lg" className="me-3">
                    Start Shopping
                  </Button>
                </Col>
                <Col md={6} className="text-center">
                  <i className="bi bi-shield-check" style={{ fontSize: '15rem', opacity: 0.3 }}></i>
                </Col>
              </Row>
            </Container>
          </div>
        </Carousel.Item>
      </Carousel>

      <Container>
        {/* Features Section */}
        <Row className="mb-5">
          <Col md={4} className="text-center mb-4">
            <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-truck fs-2"></i>
            </div>
            <h4>Fast Delivery</h4>
            <p className="text-muted">Quick and reliable shipping to your doorstep</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-shield-check fs-2"></i>
            </div>
            <h4>Secure Payment</h4>
            <p className="text-muted">Protected by Moniepoint's secure payment system</p>
          </Col>
          <Col md={4} className="text-center mb-4">
            <div className="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                 style={{ width: '80px', height: '80px' }}>
              <i className="bi bi-arrow-clockwise fs-2"></i>
            </div>
            <h4>Easy Returns</h4>
            <p className="text-muted">Hassle-free returns within 30 days</p>
          </Col>
        </Row>

        {/* Featured Products Section */}
        <Row className="mb-5">
          <Col>
            <h2 className="text-center mb-4">Featured Products</h2>
            <Row>
              {featuredProducts.map(product => (
                <Col md={6} lg={3} key={product.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Img 
                      variant="top" 
                      src={product.image} 
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h6">{product.name}</Card.Title>
                      <Card.Text className="text-muted small flex-grow-1">
                        {product.description.substring(0, 100)}...
                      </Card.Text>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <strong className="text-primary fs-5">
                          ₦{product.price.toLocaleString()}
                        </strong>
                        <div className="text-warning">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                            ></i>
                          ))}
                          <small className="text-muted ms-1">({product.reviews})</small>
                        </div>
                      </div>
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary" 
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? (
                            <>
                              <i className="bi bi-cart-plus me-2"></i>
                              Add to Cart
                            </>
                          ) : (
                            'Out of Stock'
                          )}
                        </Button>
                        <Button 
                          as={Link} 
                          to={`/product/${product.id}`} 
                          variant="outline-primary"
                          size="sm"
                        >
                          View Details
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <div className="text-center mt-4">
              <Button as={Link} to="/products" variant="primary" size="lg">
                View All Products
              </Button>
            </div>
          </Col>
        </Row>

        {/* Call to Action Section */}
        <Row className="mb-5">
          <Col>
            <div className="bg-primary text-white text-center py-5 rounded">
              <h3 className="mb-3">Ready to Start Shopping?</h3>
              <p className="lead mb-4">
                Join thousands of satisfied customers and experience seamless online shopping.
              </p>
              <Button as={Link} to="/register" variant="light" size="lg" className="me-3">
                Create Account
              </Button>
              <Button as={Link} to="/products" variant="outline-light" size="lg">
                Browse Products
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
