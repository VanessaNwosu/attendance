const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.method} ${req.path} not found`,
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: req.path,
      method: req.method,
      availableEndpoints: {
        auth: [
          'POST /api/auth/register',
          'POST /api/auth/login',
          'POST /api/auth/logout',
          'POST /api/auth/forgot-password',
          'PUT /api/auth/reset-password/:token',
          'GET /api/auth/me',
          'PUT /api/auth/update-details',
          'PUT /api/auth/update-password'
        ],
        products: [
          'GET /api/products',
          'GET /api/products/:id',
          'POST /api/products (admin)',
          'PUT /api/products/:id (admin)',
          'DELETE /api/products/:id (admin)'
        ],
        orders: [
          'GET /api/orders',
          'GET /api/orders/:id',
          'POST /api/orders',
          'PUT /api/orders/:id',
          'DELETE /api/orders/:id'
        ],
        cart: [
          'GET /api/cart',
          'POST /api/cart/add',
          'PUT /api/cart/update',
          'DELETE /api/cart/remove/:productId',
          'DELETE /api/cart/clear'
        ],
        payments: [
          'POST /api/payments/initialize',
          'POST /api/payments/verify',
          'POST /api/payments/webhook'
        ]
      }
    }
  });
};

module.exports = notFound;