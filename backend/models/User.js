const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please provide first name'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please provide last name'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please provide password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Please provide phone number'],
    match: [/^[+]?[0-9\s\-\(\)]+$/, 'Please provide a valid phone number']
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    zipCode: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'Nigeria'
    }
  },
  avatar: {
    type: String,
    default: 'https://via.placeholder.com/150x150.png?text=User'
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  emailVerificationToken: String,
  emailVerificationExpire: Date,
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  lastLogin: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  },
  wishlist: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Product'
  }],
  cart: [{
    product: {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for user orders
userSchema.virtual('orders', {
  ref: 'Order',
  localField: '_id',
  foreignField: 'user',
  justOne: false
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ 'cart.product': 1 });

// Encrypt password using bcrypt
userSchema.pre('save', async function(next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Update lastLogin on save
userSchema.pre('save', function(next) {
  if (!this.isNew && this.isModified()) {
    this.lastLogin = Date.now();
  }
  next();
});

// Sign JWT and return
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign(
    { 
      id: this._id,
      email: this.email,
      role: this.role 
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRE
    }
  );
};

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate and hash password token
userSchema.methods.getResetPasswordToken = function() {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

  return resetToken;
};

// Add item to cart
userSchema.methods.addToCart = function(productId, quantity = 1) {
  const cartProductIndex = this.cart.findIndex(cp => {
    return cp.product.toString() === productId.toString();
  });

  let newQuantity = quantity;
  const updatedCartItems = [...this.cart];

  if (cartProductIndex >= 0) {
    newQuantity = this.cart[cartProductIndex].quantity + quantity;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
    updatedCartItems[cartProductIndex].addedAt = Date.now();
  } else {
    updatedCartItems.push({
      product: productId,
      quantity: newQuantity,
      addedAt: Date.now()
    });
  }
  
  this.cart = updatedCartItems;
  return this.save();
};

// Remove item from cart
userSchema.methods.removeFromCart = function(productId) {
  const updatedCartItems = this.cart.filter(item => {
    return item.product.toString() !== productId.toString();
  });
  this.cart = updatedCartItems;
  return this.save();
};

// Update cart item quantity
userSchema.methods.updateCartItemQuantity = function(productId, quantity) {
  const cartProductIndex = this.cart.findIndex(cp => {
    return cp.product.toString() === productId.toString();
  });

  if (cartProductIndex >= 0) {
    if (quantity <= 0) {
      return this.removeFromCart(productId);
    } else {
      this.cart[cartProductIndex].quantity = quantity;
      this.cart[cartProductIndex].addedAt = Date.now();
      return this.save();
    }
  }
  return Promise.resolve(this);
};

// Clear cart
userSchema.methods.clearCart = function() {
  this.cart = [];
  return this.save();
};

// Get cart total
userSchema.methods.getCartTotal = async function() {
  await this.populate('cart.product');
  return this.cart.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);
};

module.exports = mongoose.model('User', userSchema);