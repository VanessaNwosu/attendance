import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ListingCard = ({ listing }) => {
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

  return (
    <Card className="h-100 shadow-sm listing-card">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={listing.imageUrl} 
          style={{ height: '200px', objectFit: 'cover' }}
          alt={listing.title}
        />
        <Badge 
          bg={getCategoryColor(listing.category)} 
          className="position-absolute top-0 start-0 m-2"
        >
          {getCategoryLabel(listing.category)}
        </Badge>
        {!listing.available && (
          <Badge 
            bg="danger" 
            className="position-absolute top-0 end-0 m-2"
          >
            Sold/Rented
          </Badge>
        )}
      </div>
      
      <Card.Body className="d-flex flex-column">
        <Card.Title className="h5 mb-2">{listing.title}</Card.Title>
        <Card.Text className="text-muted small mb-2">
          <i className="bi bi-geo-alt"></i> {listing.location}
        </Card.Text>
        
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span className="fw-bold text-primary fs-5">
            {formatPrice(listing.price, listing.category)}
          </span>
          <small className="text-muted">{listing.propertyType}</small>
        </div>

        <div className="d-flex justify-content-between text-muted small mb-3">
          <span><i className="bi bi-house"></i> {listing.bedrooms} bed</span>
          <span><i className="bi bi-droplet"></i> {listing.bathrooms} bath</span>
          <span><i className="bi bi-arrows-angle-expand"></i> {listing.sqft} sqft</span>
        </div>

        <Card.Text className="text-muted small mb-3 flex-grow-1">
          {listing.description.length > 100 
            ? `${listing.description.substring(0, 100)}...` 
            : listing.description}
        </Card.Text>

        <div className="mt-auto">
          <div className="d-flex gap-2">
            <Button 
              as={Link} 
              to={`/listing/${listing.id}`}
              variant="outline-primary" 
              size="sm"
              className="flex-grow-1"
            >
              View Details
            </Button>
            <Button 
              as={Link}
              to={`/inquiry/${listing.id}`}
              variant="primary" 
              size="sm"
            >
              Inquire
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ListingCard;