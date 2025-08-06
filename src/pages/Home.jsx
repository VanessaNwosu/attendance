import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, InputGroup, ButtonGroup } from 'react-bootstrap';
import Navbar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import { searchListings, getAvailableListings } from "../data/listings";

const Home = () => {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load initial listings
    const availableListings = getAvailableListings();
    setListings(availableListings);
    setFilteredListings(availableListings);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Filter listings based on search term and category
    const filtered = searchListings(searchTerm, selectedCategory);
    setFilteredListings(filtered);
  }, [searchTerm, selectedCategory]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory('all');
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Container className="mt-4">
          <div className="text-center">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      
      <Container fluid className="py-4">
        {/* Hero Section */}
        <Row className="mb-4">
          <Col>
            <div className="text-center py-5 bg-primary text-white rounded">
              <h1 className="display-4 fw-bold mb-3">Find Your Dream Home</h1>
              <p className="lead">Discover the perfect property for sale, rent, or purchase</p>
            </div>
          </Col>
        </Row>

        {/* Search and Filter Section */}
        <Row className="mb-4">
          <Col>
            <div className="bg-light p-4 rounded shadow-sm">
              <Row className="align-items-center">
                <Col md={6} className="mb-3 mb-md-0">
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search by location, property type, or description..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <Button variant="outline-secondary">
                      <i className="bi bi-search"></i>
                    </Button>
                  </InputGroup>
                </Col>
                
                <Col md={4} className="mb-3 mb-md-0">
                  <ButtonGroup className="w-100">
                    <Button
                      variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
                      onClick={() => handleCategoryChange('all')}
                    >
                      All
                    </Button>
                    <Button
                      variant={selectedCategory === 'sale' ? 'success' : 'outline-success'}
                      onClick={() => handleCategoryChange('sale')}
                    >
                      For Sale
                    </Button>
                    <Button
                      variant={selectedCategory === 'rent' ? 'info' : 'outline-info'}
                      onClick={() => handleCategoryChange('rent')}
                    >
                      For Rent
                    </Button>
                    <Button
                      variant={selectedCategory === 'buy' ? 'warning' : 'outline-warning'}
                      onClick={() => handleCategoryChange('buy')}
                    >
                      For Purchase
                    </Button>
                  </ButtonGroup>
                </Col>
                
                <Col md={2}>
                  <Button variant="outline-secondary" onClick={clearSearch} className="w-100">
                    Clear
                  </Button>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Results Summary */}
        <Row className="mb-3">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                Available Properties 
                <span className="badge bg-secondary ms-2">{filteredListings.length}</span>
              </h4>
              {(searchTerm || selectedCategory !== 'all') && (
                <small className="text-muted">
                  {searchTerm && `Searching for: "${searchTerm}"`}
                  {searchTerm && selectedCategory !== 'all' && ' • '}
                  {selectedCategory !== 'all' && `Category: ${selectedCategory}`}
                </small>
              )}
            </div>
          </Col>
        </Row>

        {/* Listings Grid */}
        <Row>
          {filteredListings.length > 0 ? (
            filteredListings.map((listing) => (
              <Col md={6} lg={4} xl={3} className="mb-4" key={listing.id}>
                <ListingCard listing={listing} />
              </Col>
            ))
          ) : (
            <Col>
              <div className="text-center py-5">
                <i className="bi bi-house display-1 text-muted"></i>
                <h3 className="mt-3 text-muted">No Properties Found</h3>
                <p className="text-muted">
                  {searchTerm || selectedCategory !== 'all' 
                    ? "Try adjusting your search criteria or clearing the filters."
                    : "There are currently no available properties."}
                </p>
                {(searchTerm || selectedCategory !== 'all') && (
                  <Button variant="primary" onClick={clearSearch}>
                    Clear Search
                  </Button>
                )}
              </div>
            </Col>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default Home;
