// Mock data for real estate listings
export const listings = [
  {
    id: 1,
    title: "Modern 3-Bedroom Apartment",
    description: "Beautiful modern apartment with stunning city views. Features include spacious bedrooms, updated kitchen, and in-unit laundry.",
    price: 450000,
    category: "sale",
    location: "Downtown Los Angeles, CA",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1200,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=500",
      "https://images.unsplash.com/photo-1560448204-61ef21a9390f?w=500",
      "https://images.unsplash.com/photo-1560448205-17d3a46c84de?w=500"
    ],
    published: true,
    available: true,
    propertyType: "Apartment",
    yearBuilt: 2019,
    parking: "1 space",
    amenities: ["Pool", "Gym", "Concierge", "Roof Deck"],
    datePosted: "2024-01-15",
    agentName: "Sarah Johnson",
    agentPhone: "+1-555-0123",
    agentEmail: "sarah@realestate.com"
  },
  {
    id: 2,
    title: "Cozy 2-Bedroom House for Rent",
    description: "Charming house perfect for small families. Great neighborhood with excellent schools nearby.",
    price: 2500,
    category: "rent",
    location: "Suburban Chicago, IL",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 950,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
    images: [
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500",
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=500"
    ],
    published: true,
    available: true,
    propertyType: "House",
    yearBuilt: 2015,
    parking: "Driveway",
    amenities: ["Garden", "Fireplace", "Basement"],
    datePosted: "2024-01-20",
    agentName: "Mike Davis",
    agentPhone: "+1-555-0124",
    agentEmail: "mike@realestate.com"
  },
  {
    id: 3,
    title: "Luxury 4-Bedroom Villa",
    description: "Stunning luxury villa with private pool and panoramic mountain views. Perfect for those seeking elegance and comfort.",
    price: 850000,
    category: "buy",
    location: "Beverly Hills, CA",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2800,
    imageUrl: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=500",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=500",
      "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=500"
    ],
    published: true,
    available: true,
    propertyType: "Villa",
    yearBuilt: 2018,
    parking: "3 car garage",
    amenities: ["Pool", "Garden", "Home Theater", "Wine Cellar", "Guest House"],
    datePosted: "2024-01-10",
    agentName: "Emma Wilson",
    agentPhone: "+1-555-0125",
    agentEmail: "emma@realestate.com"
  },
  {
    id: 4,
    title: "Studio Apartment Downtown",
    description: "Perfect for young professionals. Located in the heart of the city with easy access to public transportation.",
    price: 1800,
    category: "rent",
    location: "Manhattan, NY",
    bedrooms: 0,
    bathrooms: 1,
    sqft: 450,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=500",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=500"
    ],
    published: true,
    available: true,
    propertyType: "Studio",
    yearBuilt: 2020,
    parking: "Street parking",
    amenities: ["Gym", "Doorman", "Laundry"],
    datePosted: "2024-01-25",
    agentName: "James Brown",
    agentPhone: "+1-555-0126",
    agentEmail: "james@realestate.com"
  },
  {
    id: 5,
    title: "Family Home with Large Garden",
    description: "Spacious family home perfect for growing families. Large backyard and quiet neighborhood.",
    price: 380000,
    category: "sale",
    location: "Austin, TX",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 1600,
    imageUrl: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
    images: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=500",
      "https://images.unsplash.com/photo-1571055107559-3e67626fa8be?w=500"
    ],
    published: false, // This one is unpublished
    available: true,
    propertyType: "House",
    yearBuilt: 2012,
    parking: "2 car garage",
    amenities: ["Garden", "Fireplace", "Deck"],
    datePosted: "2024-01-22",
    agentName: "Lisa Garcia",
    agentPhone: "+1-555-0127",
    agentEmail: "lisa@realestate.com"
  },
  {
    id: 6,
    title: "Penthouse with City Views",
    description: "Exclusive penthouse with breathtaking city views. Premium finishes throughout.",
    price: 1200000,
    category: "buy",
    location: "Seattle, WA",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2000,
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=500",
      "https://images.unsplash.com/photo-1592595896616-c37162298647?w=500"
    ],
    published: true,
    available: false, // This one has been sold/rented
    propertyType: "Penthouse",
    yearBuilt: 2021,
    parking: "2 spaces + storage",
    amenities: ["Concierge", "Spa", "Rooftop Terrace", "Wine Storage"],
    datePosted: "2024-01-05",
    agentName: "David Lee",
    agentPhone: "+1-555-0128",
    agentEmail: "david@realestate.com"
  }
];

export const getPublishedListings = () => {
  return listings.filter(listing => listing.published);
};

export const getAvailableListings = () => {
  return listings.filter(listing => listing.published && listing.available);
};

export const getListingsByCategory = (category) => {
  return listings.filter(listing => listing.published && listing.available && listing.category === category);
};

export const searchListings = (query, category = null) => {
  let filteredListings = getAvailableListings();
  
  if (category && category !== 'all') {
    filteredListings = filteredListings.filter(listing => listing.category === category);
  }
  
  if (query) {
    const searchLower = query.toLowerCase();
    filteredListings = filteredListings.filter(listing =>
      listing.title.toLowerCase().includes(searchLower) ||
      listing.description.toLowerCase().includes(searchLower) ||
      listing.location.toLowerCase().includes(searchLower) ||
      listing.propertyType.toLowerCase().includes(searchLower)
    );
  }
  
  return filteredListings;
};

export const getListingById = (id) => {
  return listings.find(listing => listing.id === parseInt(id));
};