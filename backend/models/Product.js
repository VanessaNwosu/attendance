const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    maxlength: [500, 'Review comment cannot exceed 500 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  _id: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Product description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: [0, 'Price cannot be negative']
  },
  originalPrice: {
    type: Number,
    min: [0, 'Original price cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative'],
    max: [100, 'Discount cannot exceed 100%']
  },
  images: [{
    public_id: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Product Image'
    }
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: {
      values: [
        'Electronics',
        'Clothing',
        'Accessories',
        'Home & Kitchen',
        'Sports',
        'Beauty',
        'Books',
        'Toys',
        'Automotive',
        'Health',
        'Footwear',
        'Jewelry'
      ],
      message: 'Please select a valid category'
    }
  },
  subCategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  model: {
    type: String,
    trim: true
  },
  sku: {
    type: String,
    unique: true,
    required: [true, 'Please provide product SKU']
  },
  stock: {
    type: Number,
    required: [true, 'Please provide stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  lowStockThreshold: {
    type: Number,
    default: 10,
    min: [0, 'Low stock threshold cannot be negative']
  },
  weight: {
    type: Number,
    min: [0, 'Weight cannot be negative']
  },
  dimensions: {
    length: {
      type: Number,
      min: [0, 'Length cannot be negative']
    },
    width: {
      type: Number,
      min: [0, 'Width cannot be negative']
    },
    height: {
      type: Number,
      min: [0, 'Height cannot be negative']
    }
  },
  colors: [{
    name: String,
    hexCode: String
  }],
  sizes: [{
    name: String,
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Size stock cannot be negative']
    }
  }],
  features: [String],
  specifications: [{
    name: String,
    value: String
  }],
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be negative'],
      max: [5, 'Rating cannot exceed 5']
    },
    count: {
      type: Number,
      default: 0,
      min: [0, 'Rating count cannot be negative']
    }
  },
  reviews: [reviewSchema],
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  saleStartDate: Date,
  saleEndDate: Date,
  tags: [String],
  metaTitle: {
    type: String,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  slug: {
    type: String,
    unique: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  salesCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ 'ratings.average': -1 });
productSchema.index({ isFeatured: 1, isActive: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ createdAt: -1 });

// Virtual for in stock status
productSchema.virtual('inStock').get(function() {
  return this.stock > 0;
});

// Virtual for low stock status
productSchema.virtual('isLowStock').get(function() {
  return this.stock <= this.lowStockThreshold && this.stock > 0;
});

// Virtual for effective price (considering discount)
productSchema.virtual('effectivePrice').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - (this.originalPrice * this.discount / 100);
  }
  return this.price;
});

// Virtual for savings amount
productSchema.virtual('savings').get(function() {
  if (this.discount > 0 && this.originalPrice) {
    return this.originalPrice - this.effectivePrice;
  }
  return 0;
});

// Virtual for total stock (including sizes)
productSchema.virtual('totalStock').get(function() {
  if (this.sizes && this.sizes.length > 0) {
    return this.sizes.reduce((total, size) => total + size.stock, 0);
  }
  return this.stock;
});

// Create slug from name before saving
productSchema.pre('save', function(next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
    
    // Add random string to ensure uniqueness
    this.slug += '-' + Math.random().toString(36).substr(2, 9);
  }
  next();
});

// Set original price if not provided
productSchema.pre('save', function(next) {
  if (!this.originalPrice) {
    this.originalPrice = this.price;
  }
  next();
});

// Update ratings when reviews change
productSchema.pre('save', function(next) {
  if (this.isModified('reviews')) {
    if (this.reviews.length > 0) {
      const totalRating = this.reviews.reduce((sum, review) => sum + review.rating, 0);
      this.ratings.average = (totalRating / this.reviews.length).toFixed(1);
      this.ratings.count = this.reviews.length;
    } else {
      this.ratings.average = 0;
      this.ratings.count = 0;
    }
  }
  next();
});

// Instance method to add review
productSchema.methods.addReview = function(userId, userName, rating, comment) {
  // Check if user already reviewed this product
  const existingReview = this.reviews.find(review => 
    review.user.toString() === userId.toString()
  );

  if (existingReview) {
    // Update existing review
    existingReview.rating = rating;
    existingReview.comment = comment;
    existingReview.createdAt = new Date();
  } else {
    // Add new review
    this.reviews.push({
      user: userId,
      name: userName,
      rating,
      comment
    });
  }

  return this.save();
};

// Instance method to remove review
productSchema.methods.removeReview = function(userId) {
  this.reviews = this.reviews.filter(review => 
    review.user.toString() !== userId.toString()
  );
  return this.save();
};

// Instance method to update stock
productSchema.methods.updateStock = function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    this.stock = Math.max(0, this.stock - quantity);
  } else if (operation === 'add') {
    this.stock += quantity;
  }
  return this.save();
};

// Instance method to increment view count
productSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment sales count
productSchema.methods.incrementSalesCount = function(quantity = 1) {
  this.salesCount += quantity;
  return this.save();
};

// Static method to get featured products
productSchema.statics.getFeaturedProducts = function(limit = 10) {
  return this.find({ isFeatured: true, isActive: true })
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static method to get products on sale
productSchema.statics.getOnSaleProducts = function(limit = 10) {
  return this.find({ 
    isOnSale: true, 
    isActive: true,
    saleStartDate: { $lte: new Date() },
    $or: [
      { saleEndDate: { $gte: new Date() } },
      { saleEndDate: { $exists: false } }
    ]
  })
  .limit(limit)
  .sort({ discount: -1 });
};

// Static method to search products
productSchema.statics.searchProducts = function(query, options = {}) {
  const searchQuery = {
    $text: { $search: query },
    isActive: true
  };

  if (options.category) {
    searchQuery.category = options.category;
  }

  if (options.minPrice || options.maxPrice) {
    searchQuery.price = {};
    if (options.minPrice) searchQuery.price.$gte = options.minPrice;
    if (options.maxPrice) searchQuery.price.$lte = options.maxPrice;
  }

  return this.find(searchQuery, { score: { $meta: 'textScore' } })
    .sort({ score: { $meta: 'textScore' } });
};

module.exports = mongoose.model('Product', productSchema);