# ShopEase Backend API

A comprehensive Node.js/Express backend API for the ShopEase e-commerce platform with Moniepoint payment integration.

## 🚀 Features

### Core Functionality
- **User Authentication**: JWT-based auth with registration, login, password reset
- **Product Management**: CRUD operations for products with categories, images, reviews
- **Shopping Cart**: Persistent cart functionality with user sessions
- **Order Management**: Complete order lifecycle from creation to delivery
- **Payment Processing**: Moniepoint integration for secure payments
- **Email Services**: Order confirmations, password reset, etc.
- **File Uploads**: Product images with Cloudinary integration
- **Admin Panel**: Administrative functions for managing the store

### Security Features
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: express-validator for request validation
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet.js**: Security headers for Express apps

### Payment Integration
- **Moniepoint Gateway**: Full integration with Moniepoint payment services
- **Webhook Support**: Real-time payment status updates
- **Refund Processing**: Automated refund handling
- **Transaction Tracking**: Complete payment audit trail

## 📋 Prerequisites

- Node.js (v16.0.0 or higher)
- MongoDB (v4.4 or higher)
- Moniepoint merchant account
- SMTP email service (Gmail, SendGrid, etc.)
- Cloudinary account (for image uploads)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shopease-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables** (see Environment Variables section)

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

7. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## ⚙️ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/shopease

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Moniepoint Configuration
MONIEPOINT_BASE_URL=https://api.moniepoint.com
MONIEPOINT_SECRET_KEY=your_moniepoint_secret_key
MONIEPOINT_PUBLIC_KEY=your_moniepoint_public_key
MONIEPOINT_CONTRACT_CODE=your_contract_code

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Admin Configuration
ADMIN_EMAIL=admin@shopease.com
ADMIN_PASSWORD=admin123456
```

## 📚 API Documentation

### Base URL
```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+2348001234567"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <jwt_token>
```

#### Update User Details
```http
PUT /api/auth/update-details
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+2348001234567"
}
```

#### Update Password
```http
PUT /api/auth/update-password
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### Forgot Password
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "john@example.com"
}
```

#### Reset Password
```http
PUT /api/auth/reset-password/:token
Content-Type: application/json

{
  "password": "newpassword123"
}
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=10&category=Electronics&search=laptop&sort=price
```

#### Get Single Product
```http
GET /api/products/:id
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "name": "iPhone 15 Pro",
  "description": "Latest iPhone with advanced features",
  "price": 999.99,
  "category": "Electronics",
  "brand": "Apple",
  "stock": 50,
  "images": [
    {
      "url": "https://example.com/image1.jpg",
      "alt": "iPhone 15 Pro"
    }
  ]
}
```

#### Update Product (Admin)
```http
PUT /api/products/:id
Authorization: Bearer <admin_jwt_token>
```

#### Delete Product (Admin)
```http
DELETE /api/products/:id
Authorization: Bearer <admin_jwt_token>
```

### Cart Endpoints

#### Get User Cart
```http
GET /api/cart
Authorization: Bearer <jwt_token>
```

#### Add to Cart
```http
POST /api/cart/add
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 2
}
```

#### Update Cart Item
```http
PUT /api/cart/update
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "productId": "product_id_here",
  "quantity": 3
}
```

#### Remove from Cart
```http
DELETE /api/cart/remove/:productId
Authorization: Bearer <jwt_token>
```

#### Clear Cart
```http
DELETE /api/cart/clear
Authorization: Bearer <jwt_token>
```

### Order Endpoints

#### Get User Orders
```http
GET /api/orders?page=1&limit=10&status=pending
Authorization: Bearer <jwt_token>
```

#### Get Single Order
```http
GET /api/orders/:id
Authorization: Bearer <jwt_token>
```

#### Create Order
```http
POST /api/orders
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderItems": [
    {
      "product": "product_id",
      "quantity": 2,
      "price": 99.99
    }
  ],
  "shippingAddress": {
    "firstName": "John",
    "lastName": "Doe",
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "zipCode": "100001",
    "phone": "+2348001234567"
  },
  "paymentMethod": "moniepoint"
}
```

#### Update Order Status (Admin)
```http
PUT /api/orders/:id/status
Authorization: Bearer <admin_jwt_token>
Content-Type: application/json

{
  "status": "shipped",
  "notes": "Order dispatched via DHL"
}
```

### Payment Endpoints

#### Initialize Payment
```http
POST /api/payments/initialize
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "order_id_here",
  "amount": 299.99,
  "currency": "NGN",
  "callbackUrl": "https://yoursite.com/payment/callback"
}
```

#### Verify Payment
```http
POST /api/payments/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "reference": "payment_reference_here"
}
```

#### Payment Webhook (Moniepoint)
```http
POST /api/payments/webhook
Content-Type: application/json
X-Moniepoint-Signature: <webhook_signature>

{
  "event": "charge.success",
  "data": {
    "reference": "MP_1234567890",
    "amount": 29999,
    "currency": "NGN",
    "status": "success"
  }
}
```

### Contact Endpoints

#### Send Contact Message
```http
POST /api/contact
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "general",
  "message": "Hello, I have a question about my order."
}
```

## 🔧 Moniepoint Integration

### Setup

1. **Get Moniepoint Credentials**
   - Sign up for a Moniepoint merchant account
   - Obtain your Secret Key, Public Key, and Contract Code
   - Set webhook URL in Moniepoint dashboard

2. **Configure Environment Variables**
   ```env
   MONIEPOINT_BASE_URL=https://api.moniepoint.com
   MONIEPOINT_SECRET_KEY=your_secret_key
   MONIEPOINT_PUBLIC_KEY=your_public_key
   MONIEPOINT_CONTRACT_CODE=your_contract_code
   ```

3. **Webhook Configuration**
   - URL: `https://yourdomain.com/api/payments/webhook`
   - Events: `charge.success`, `charge.failed`

### Payment Flow

1. **Initialize Payment**
   - Frontend calls `/api/payments/initialize`
   - Backend creates payment session with Moniepoint
   - Returns payment URL for customer

2. **Customer Payment**
   - Customer completes payment on Moniepoint
   - Moniepoint sends webhook to your server
   - Backend verifies payment and updates order

3. **Payment Verification**
   - Frontend calls `/api/payments/verify` with reference
   - Backend confirms payment status
   - Order status updated accordingly

## 🗄️ Database Schema

### Users Collection
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user/admin),
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  cart: [{
    product: ObjectId (ref: Product),
    quantity: Number,
    addedAt: Date
  }],
  wishlist: [ObjectId (ref: Product)],
  isActive: Boolean,
  isEmailVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  originalPrice: Number,
  discount: Number,
  images: [{
    public_id: String,
    url: String,
    alt: String
  }],
  category: String,
  brand: String,
  sku: String (unique),
  stock: Number,
  ratings: {
    average: Number,
    count: Number
  },
  reviews: [{
    user: ObjectId (ref: User),
    name: String,
    rating: Number,
    comment: String,
    createdAt: Date
  }],
  isActive: Boolean,
  isFeatured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  orderNumber: String (unique),
  user: ObjectId (ref: User),
  orderItems: [{
    product: ObjectId (ref: Product),
    name: String,
    image: String,
    price: Number,
    quantity: Number
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String
  },
  paymentInfo: {
    method: String,
    status: String,
    transactionId: String,
    moniepointReference: String,
    amount: Number,
    paidAt: Date
  },
  itemsPrice: Number,
  taxPrice: Number,
  shippingPrice: Number,
  totalPrice: Number,
  status: String,
  orderDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

## 🚦 Error Handling

The API uses consistent error response format:

```json
{
  "success": false,
  "error": {
    "message": "Error description",
    "statusCode": 400,
    "timestamp": "2024-01-01T12:00:00.000Z",
    "path": "/api/endpoint",
    "method": "POST"
  }
}
```

### Common Error Codes
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limiting)
- `500` - Internal Server Error

## 🔒 Security Best Practices

### Authentication
- JWT tokens with expiration
- Password hashing with bcrypt
- Rate limiting on sensitive endpoints
- Email verification for new accounts

### Data Protection
- Input validation and sanitization
- MongoDB injection prevention
- XSS protection with helmet
- CORS configuration

### Payment Security
- Webhook signature verification
- Secure API key management
- HTTPS enforcement in production
- PCI DSS compliance considerations

## 📊 Monitoring & Logging

### Development
- Morgan HTTP request logging
- Console error logging
- Detailed error stack traces

### Production
- Structured logging with timestamps
- Error tracking service integration
- Performance monitoring
- Payment audit trails

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test auth.test.js
```

## 📈 Performance Optimization

### Database
- MongoDB indexes on frequently queried fields
- Aggregation pipelines for complex queries
- Connection pooling
- Query optimization

### API
- Response compression
- Request rate limiting
- Caching strategies
- Image optimization

## 🚀 Deployment

### Environment Setup
1. Configure production environment variables
2. Set up MongoDB Atlas or production MongoDB
3. Configure email service (SendGrid, etc.)
4. Set up Cloudinary for image hosting
5. Configure Moniepoint webhook URLs

### Docker Deployment
```dockerfile
# Example Dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables Checklist
- [ ] `NODE_ENV=production`
- [ ] `MONGODB_URI` (production database)
- [ ] `JWT_SECRET` (secure random string)
- [ ] Moniepoint credentials
- [ ] Email service credentials
- [ ] Cloudinary credentials
- [ ] Frontend URL for CORS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For technical support:
- Email: dev-support@shopease.com
- Documentation: [API Docs](https://docs.shopease.com)
- Issues: [GitHub Issues](https://github.com/shopease/backend/issues)

---

**ShopEase Backend** - Powering secure e-commerce with Moniepoint integration 🚀