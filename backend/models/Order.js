const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: [0, 'Price cannot be negative']
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  size: String,
  color: String,
  sku: String
}, {
  _id: false
});

const shippingAddressSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  state: {
    type: String,
    required: true,
    trim: true
  },
  zipCode: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    trim: true,
    default: 'Nigeria'
  },
  phone: {
    type: String,
    required: true,
    trim: true
  }
}, {
  _id: false
});

const paymentInfoSchema = new mongoose.Schema({
  method: {
    type: String,
    required: true,
    enum: ['moniepoint', 'bank_transfer', 'card', 'wallet']
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'processing', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: String,
  moniepointReference: String,
  amount: {
    type: Number,
    required: true,
    min: [0, 'Payment amount cannot be negative']
  },
  currency: {
    type: String,
    default: 'NGN'
  },
  paidAt: Date,
  failureReason: String,
  refundReason: String,
  refundedAt: Date,
  refundAmount: {
    type: Number,
    min: [0, 'Refund amount cannot be negative']
  }
}, {
  _id: false
});

const trackingInfoSchema = new mongoose.Schema({
  carrier: String,
  trackingNumber: String,
  trackingUrl: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  updates: [{
    status: String,
    location: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    description: String
  }]
}, {
  _id: false
});

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true
  },
  orderItems: [orderItemSchema],
  shippingAddress: shippingAddressSchema,
  paymentInfo: paymentInfoSchema,
  trackingInfo: trackingInfoSchema,
  itemsPrice: {
    type: Number,
    required: true,
    min: [0, 'Items price cannot be negative']
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Tax price cannot be negative']
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
    min: [0, 'Shipping price cannot be negative']
  },
  discountAmount: {
    type: Number,
    default: 0,
    min: [0, 'Discount amount cannot be negative']
  },
  totalPrice: {
    type: Number,
    required: true,
    min: [0, 'Total price cannot be negative']
  },
  status: {
    type: String,
    required: true,
    enum: [
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
      'refunded'
    ],
    default: 'pending'
  },
  orderNotes: String,
  adminNotes: String,
  cancellationReason: String,
  returnReason: String,
  isGift: {
    type: Boolean,
    default: false
  },
  giftMessage: String,
  couponCode: String,
  orderDate: {
    type: Date,
    default: Date.now
  },
  confirmedAt: Date,
  shippedAt: Date,
  deliveredAt: Date,
  cancelledAt: Date,
  returnedAt: Date,
  refundedAt: Date,
  estimatedDeliveryDate: Date,
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  source: {
    type: String,
    enum: ['web', 'mobile', 'admin'],
    default: 'web'
  },
  customerNotes: String,
  internalNotes: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
orderSchema.index({ user: 1, orderDate: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'paymentInfo.status': 1 });
orderSchema.index({ email: 1 });
orderSchema.index({ orderDate: -1 });

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.orderItems.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.orderDate) / (1000 * 60 * 60 * 24));
});

// Virtual for is paid status
orderSchema.virtual('isPaid').get(function() {
  return this.paymentInfo.status === 'completed';
});

// Virtual for can be cancelled
orderSchema.virtual('canBeCancelled').get(function() {
  return ['pending', 'confirmed', 'processing'].includes(this.status);
});

// Virtual for can be returned
orderSchema.virtual('canBeReturned').get(function() {
  return this.status === 'delivered' && this.orderAge <= 30; // 30 days return policy
});

// Generate order number before saving
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Get count of orders today
    const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
    
    const todayOrdersCount = await this.constructor.countDocuments({
      orderDate: { $gte: startOfDay, $lt: endOfDay }
    });
    
    const orderSequence = (todayOrdersCount + 1).toString().padStart(4, '0');
    this.orderNumber = `ORD-${year}${month}${day}-${orderSequence}`;
  }
  next();
});

// Update status timestamps
orderSchema.pre('save', function(next) {
  const now = new Date();
  
  if (this.isModified('status')) {
    switch (this.status) {
      case 'confirmed':
        if (!this.confirmedAt) this.confirmedAt = now;
        break;
      case 'shipped':
        if (!this.shippedAt) this.shippedAt = now;
        break;
      case 'delivered':
        if (!this.deliveredAt) this.deliveredAt = now;
        break;
      case 'cancelled':
        if (!this.cancelledAt) this.cancelledAt = now;
        break;
      case 'returned':
        if (!this.returnedAt) this.returnedAt = now;
        break;
      case 'refunded':
        if (!this.refundedAt) this.refundedAt = now;
        break;
    }
  }
  
  if (this.isModified('paymentInfo.status') && this.paymentInfo.status === 'completed') {
    if (!this.paymentInfo.paidAt) this.paymentInfo.paidAt = now;
  }
  
  next();
});

// Instance method to calculate estimated delivery
orderSchema.methods.calculateEstimatedDelivery = function() {
  const now = new Date();
  const estimatedDays = this.shippingPrice === 0 ? 5 : 3; // Free shipping takes longer
  
  this.estimatedDeliveryDate = new Date(now.getTime() + (estimatedDays * 24 * 60 * 60 * 1000));
  return this.estimatedDeliveryDate;
};

// Instance method to update order status
orderSchema.methods.updateStatus = function(newStatus, notes = '') {
  this.status = newStatus;
  if (notes) {
    this.adminNotes = notes;
  }
  return this.save();
};

// Instance method to update payment status
orderSchema.methods.updatePaymentStatus = function(status, transactionId = '', failureReason = '') {
  this.paymentInfo.status = status;
  if (transactionId) {
    this.paymentInfo.transactionId = transactionId;
  }
  if (failureReason) {
    this.paymentInfo.failureReason = failureReason;
  }
  return this.save();
};

// Instance method to add tracking update
orderSchema.methods.addTrackingUpdate = function(status, location, description) {
  if (!this.trackingInfo.updates) {
    this.trackingInfo.updates = [];
  }
  
  this.trackingInfo.updates.push({
    status,
    location,
    description,
    timestamp: new Date()
  });
  
  return this.save();
};

// Instance method to cancel order
orderSchema.methods.cancelOrder = function(reason) {
  if (!this.canBeCancelled) {
    throw new Error('This order cannot be cancelled');
  }
  
  this.status = 'cancelled';
  this.cancellationReason = reason;
  this.cancelledAt = new Date();
  
  return this.save();
};

// Instance method to process refund
orderSchema.methods.processRefund = function(amount, reason) {
  this.paymentInfo.status = 'refunded';
  this.paymentInfo.refundAmount = amount;
  this.paymentInfo.refundReason = reason;
  this.paymentInfo.refundedAt = new Date();
  this.status = 'refunded';
  
  return this.save();
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function() {
  const stats = await this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  const totalOrders = await this.countDocuments();
  const totalRevenue = await this.aggregate([
    {
      $match: { 'paymentInfo.status': 'completed' }
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$totalPrice' }
      }
    }
  ]);
  
  return {
    totalOrders,
    totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    statusBreakdown: stats
  };
};

// Static method to get recent orders
orderSchema.statics.getRecentOrders = function(limit = 10) {
  return this.find()
    .populate('user', 'firstName lastName email')
    .sort({ orderDate: -1 })
    .limit(limit);
};

// Static method to get user order history
orderSchema.statics.getUserOrderHistory = function(userId, options = {}) {
  const query = { user: userId };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('orderItems.product', 'name image slug')
    .sort({ orderDate: -1 })
    .limit(options.limit || 20)
    .skip(options.skip || 0);
};

module.exports = mongoose.model('Order', orderSchema);