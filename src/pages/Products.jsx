import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';

const Products = () => {
  const { products, getProductsByCategory, searchProducts, getCategories } = useProducts();
  const { addToCart } = useCart();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('name');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');

  const categories = getCategories();

  useEffect(() => {
    let result = products;

    // Apply search filter
    if (searchQuery) {
      result = searchProducts(searchQuery);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => 
        product.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Apply sorting
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(result);
  }, [selectedCategory, sortBy, searchQuery, products, searchProducts]);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    if (category) setSelectedCategory(category);
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', category);
    }
    setSearchParams(newParams);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <Container className="py-4">
      <Row>
        {/* Sidebar Filters */}
        <Col md={3} className="mb-4">
          <div className="bg-light p-3 rounded">
            <h5 className="mb-3">Filters</h5>
            
            {/* Category Filter */}
            <div className="mb-4">
              <h6 className="fw-bold">Categories</h6>
              <Form.Check
                type="radio"
                label="All Categories"
                name="category"
                checked={selectedCategory === 'all'}
                onChange={() => handleCategoryChange('all')}
                className="mb-2"
              />
              {categories.map(category => (
                <Form.Check
                  key={category}
                  type="radio"
                  label={category}
                  name="category"
                  checked={selectedCategory.toLowerCase() === category.toLowerCase()}
                  onChange={() => handleCategoryChange(category.toLowerCase())}
                  className="mb-2"
                />
              ))}
            </div>

            {/* Sort Options */}
            <div className="mb-4">
              <h6 className="fw-bold">Sort By</h6>
              <Form.Select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price (Low to High)</option>
                <option value="price-high">Price (High to Low)</option>
                <option value="rating">Rating (High to Low)</option>
              </Form.Select>
            </div>

            {/* Search Filter */}
            <div className="mb-4">
              <h6 className="fw-bold">Search</h6>
              <Form.Control
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </Col>

        {/* Products Grid */}
        <Col md={9}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2>Products</h2>
              <p className="text-muted">
                Showing {filteredProducts.length} of {products.length} products
                {selectedCategory !== 'all' && (
                  <Badge bg="primary" className="ms-2">
                    {selectedCategory}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge bg="info" className="ms-2">
                    "{searchQuery}"
                  </Badge>
                )}
              </p>
            </div>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-search fs-1 text-muted"></i>
              <h4 className="mt-3">No products found</h4>
              <p className="text-muted">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <Row>
              {filteredProducts.map(product => (
                <Col md={6} lg={4} key={product.id} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <div className="position-relative">
                      <Card.Img 
                        variant="top" 
                        src={product.image} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      {!product.inStock && (
                        <Badge 
                          bg="danger" 
                          className="position-absolute top-0 end-0 m-2"
                        >
                          Out of Stock
                        </Badge>
                      )}
                    </div>
                    <Card.Body className="d-flex flex-column">
                      <div className="mb-2">
                        <Badge bg="secondary" className="mb-2">
                          {product.category}
                        </Badge>
                      </div>
                      <Card.Title className="h6">{product.name}</Card.Title>
                      <Card.Text className="text-muted small flex-grow-1">
                        {product.description.substring(0, 100)}...
                      </Card.Text>
                      
                      <div className="mb-2">
                        <div className="text-warning mb-1">
                          {[...Array(5)].map((_, i) => (
                            <i 
                              key={i} 
                              className={`bi bi-star${i < Math.floor(product.rating) ? '-fill' : ''}`}
                            ></i>
                          ))}
                          <small className="text-muted ms-1">
                            {product.rating} ({product.reviews} reviews)
                          </small>
                        </div>
                        <strong className="text-primary fs-5">
                          ₦{product.price.toLocaleString()}
                        </strong>
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
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Products;