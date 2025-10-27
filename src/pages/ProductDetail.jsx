import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Badge, Alert, Breadcrumb } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  
  const [quantity, setQuantity] = useState(1);
  const [showAlert, setShowAlert] = useState(false);
  
  const product = getProductById(id);

  if (!product) {
    return (
      <Container className="py-5">
        <Alert variant="danger" className="text-center">
          <h4>Product not found</h4>
          <p>The product you're looking for doesn't exist.</p>
          <Button as={Link} to="/products" variant="primary">
            Back to Products
          </Button>
        </Alert>
      </Container>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/cart');
  };

  return (
    <Container className="py-4">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item as={Link} to="/">Home</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to="/products">Products</Breadcrumb.Item>
        <Breadcrumb.Item as={Link} to={`/products?category=${product.category.toLowerCase()}`}>
          {product.category}
        </Breadcrumb.Item>
        <Breadcrumb.Item active>{product.name}</Breadcrumb.Item>
      </Breadcrumb>

      {/* Success Alert */}
      {showAlert && (
        <Alert variant="success" className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          Product added to cart successfully!
          <Button as={Link} to="/cart" variant="link" className="p-0 ms-2">
            View Cart
          </Button>
        </Alert>
      )}

      <Row>
        {/* Product Image */}
        <Col md={6} className="mb-4">
          <Card>
            <Card.Img 
              src={product.image} 
              style={{ height: '500px', objectFit: 'cover' }}
              alt={product.name}
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col md={6}>
          <div className="mb-3">
            <Badge bg="secondary" className="mb-2">{product.category}</Badge>
            <h1 className="h2">{product.name}</h1>
          </div>

          {/* Rating */}
          <div className="mb-3">
            <div className="text-warning fs-5">
              {[...Array(5)].map((_, i) => (
                <i 
                  key={i} 
                  className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                ></i>
              ))}
              <span className="text-muted ms-2 fs-6">
                {product.rating} out of 5 ({product.reviews} reviews)
              </span>
            </div>
          </div>

          {/* Price */}
          <div className="mb-4">
            <h2 className="text-primary">₦{product.price.toLocaleString()}</h2>
          </div>

          {/* Stock Status */}
          <div className="mb-4">
            {product.inStock ? (
              <Badge bg="success" className="fs-6 p-2">
                <i className="bi bi-check-circle me-1"></i>
                In Stock
              </Badge>
            ) : (
              <Badge bg="danger" className="fs-6 p-2">
                <i className="bi bi-x-circle me-1"></i>
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <h5>Description</h5>
            <p className="text-muted">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          {product.inStock && (
            <div className="mb-4">
              <label htmlFor="quantity" className="form-label fw-bold">Quantity:</label>
              <div className="d-flex align-items-center">
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <i className="bi bi-dash"></i>
                </Button>
                <span className="mx-3 fs-5 fw-bold">{quantity}</span>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  <i className="bi bi-plus"></i>
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            {product.inStock ? (
              <>
                <Button 
                  variant="primary" 
                  size="lg" 
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  Add {quantity} to Cart
                </Button>
                <Button 
                  variant="success" 
                  size="lg" 
                  onClick={handleBuyNow}
                >
                  <i className="bi bi-lightning me-2"></i>
                  Buy Now
                </Button>
              </>
            ) : (
              <Button variant="secondary" size="lg" disabled>
                Out of Stock
              </Button>
            )}
            <Button as={Link} to="/products" variant="outline-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Continue Shopping
            </Button>
          </div>

          {/* Product Features */}
          <div className="mt-4">
            <h6 className="fw-bold">Why shop with us?</h6>
            <ul className="list-unstyled">
              <li className="mb-2">
                <i className="bi bi-truck text-primary me-2"></i>
                Free shipping on orders over ₦10,000
              </li>
              <li className="mb-2">
                <i className="bi bi-shield-check text-success me-2"></i>
                Secure payment with Moniepoint
              </li>
              <li className="mb-2">
                <i className="bi bi-arrow-clockwise text-warning me-2"></i>
                30-day return policy
              </li>
              <li className="mb-2">
                <i className="bi bi-headset text-info me-2"></i>
                24/7 customer support
              </li>
            </ul>
          </div>
        </Col>
      </Row>

      {/* Additional Product Info */}
      <Row className="mt-5">
        <Col>
          <Card>
            <Card.Header>
              <h5 className="mb-0">Product Details</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6>Product Information</h6>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Category:</td>
                        <td>{product.category}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Price:</td>
                        <td>₦{product.price.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Availability:</td>
                        <td>
                          {product.inStock ? (
                            <span className="text-success">In Stock</span>
                          ) : (
                            <span className="text-danger">Out of Stock</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Rating:</td>
                        <td>{product.rating}/5 ({product.reviews} reviews)</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6>Shipping & Returns</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <strong>Shipping:</strong> 2-5 business days
                    </li>
                    <li className="mb-2">
                      <strong>Free Shipping:</strong> On orders over ₦10,000
                    </li>
                    <li className="mb-2">
                      <strong>Returns:</strong> 30-day return policy
                    </li>
                    <li className="mb-2">
                      <strong>Warranty:</strong> 1-year manufacturer warranty
                    </li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;