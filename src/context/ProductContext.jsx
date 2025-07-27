import React, { createContext, useContext, useState } from 'react';

const ProductContext = createContext();

// Sample product data
const sampleProducts = [
  {
    id: 1,
    name: "Premium Wireless Headphones",
    price: 199.99,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "High-quality wireless headphones with noise cancellation and superior sound quality.",
    inStock: true,
    rating: 4.5,
    reviews: 128
  },
  {
    id: 2,
    name: "Smart Fitness Watch",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Advanced fitness tracking with heart rate monitor, GPS, and smartphone integration.",
    inStock: true,
    rating: 4.7,
    reviews: 96
  },
  {
    id: 3,
    name: "Organic Cotton T-Shirt",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
    category: "Clothing",
    description: "Comfortable and sustainable organic cotton t-shirt in various colors.",
    inStock: true,
    rating: 4.3,
    reviews: 64
  },
  {
    id: 4,
    name: "Leather Crossbody Bag",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
    category: "Accessories",
    description: "Stylish genuine leather crossbody bag perfect for everyday use.",
    inStock: true,
    rating: 4.6,
    reviews: 45
  },
  {
    id: 5,
    name: "Wireless Bluetooth Speaker",
    price: 79.99,
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
    category: "Electronics",
    description: "Portable Bluetooth speaker with 360-degree sound and waterproof design.",
    inStock: true,
    rating: 4.4,
    reviews: 87
  },
  {
    id: 6,
    name: "Running Shoes",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
    category: "Footwear",
    description: "Professional running shoes with advanced cushioning and breathable material.",
    inStock: true,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 7,
    name: "Coffee Maker",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=500&h=500&fit=crop",
    category: "Home & Kitchen",
    description: "Programmable coffee maker with thermal carafe and auto-shutdown feature.",
    inStock: false,
    rating: 4.2,
    reviews: 73
  },
  {
    id: 8,
    name: "Yoga Mat",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500&h=500&fit=crop",
    category: "Sports",
    description: "Non-slip yoga mat with extra thickness for comfort and stability.",
    inStock: true,
    rating: 4.5,
    reviews: 112
  }
];

export const ProductProvider = ({ children }) => {
  const [products] = useState(sampleProducts);
  const [featuredProducts] = useState(sampleProducts.slice(0, 4));

  const getProductById = (id) => {
    return products.find(product => product.id === parseInt(id));
  };

  const getProductsByCategory = (category) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  const searchProducts = (query) => {
    return products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase()) ||
      product.description.toLowerCase().includes(query.toLowerCase()) ||
      product.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getCategories = () => {
    return [...new Set(products.map(product => product.category))];
  };

  const value = {
    products,
    featuredProducts,
    getProductById,
    getProductsByCategory,
    searchProducts,
    getCategories
  };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};