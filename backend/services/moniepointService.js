const axios = require('axios');
const crypto = require('crypto');

class MoniepointService {
  constructor() {
    this.baseURL = process.env.MONIEPOINT_BASE_URL || 'https://api.moniepoint.com';
    this.secretKey = process.env.MONIEPOINT_SECRET_KEY;
    this.publicKey = process.env.MONIEPOINT_PUBLIC_KEY;
    this.contractCode = process.env.MONIEPOINT_CONTRACT_CODE;
  }

  // Generate reference for payment
  generateReference() {
    return 'MP_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  // Initialize payment
  async initializePayment(paymentData) {
    try {
      const reference = this.generateReference();
      
      const payload = {
        amount: Math.round(paymentData.amount * 100), // Convert to kobo
        currency: paymentData.currency || 'NGN',
        reference: reference,
        customer: {
          email: paymentData.customerEmail,
          name: paymentData.customerName,
          phone: paymentData.customerPhone
        },
        metadata: {
          orderId: paymentData.orderId,
          userId: paymentData.userId,
          custom_fields: paymentData.customFields || []
        },
        callback_url: paymentData.callbackUrl,
        channels: ['card', 'bank', 'ussd', 'qr', 'mobile_money', 'bank_transfer']
      };

      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${this.baseURL}/v1/transaction/initialize`,
        payload,
        { headers }
      );

      if (response.data.status) {
        return {
          success: true,
          data: {
            reference: reference,
            authorizationUrl: response.data.data.authorization_url,
            accessCode: response.data.data.access_code,
            paymentUrl: response.data.data.authorization_url
          }
        };
      } else {
        throw new Error(response.data.message || 'Payment initialization failed');
      }
    } catch (error) {
      console.error('Moniepoint initialization error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Payment initialization failed'
      };
    }
  }

  // Verify payment
  async verifyPayment(reference) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${this.baseURL}/v1/transaction/verify/${reference}`,
        { headers }
      );

      if (response.data.status) {
        const paymentData = response.data.data;
        return {
          success: true,
          data: {
            reference: paymentData.reference,
            amount: paymentData.amount / 100, // Convert from kobo to naira
            currency: paymentData.currency,
            status: paymentData.status,
            gateway_response: paymentData.gateway_response,
            paid_at: paymentData.paid_at,
            created_at: paymentData.created_at,
            channel: paymentData.channel,
            ip_address: paymentData.ip_address,
            metadata: paymentData.metadata,
            customer: paymentData.customer,
            authorization: paymentData.authorization
          }
        };
      } else {
        throw new Error(response.data.message || 'Payment verification failed');
      }
    } catch (error) {
      console.error('Moniepoint verification error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Payment verification failed'
      };
    }
  }

  // Verify webhook signature
  verifyWebhookSignature(payload, signature) {
    try {
      const expectedSignature = crypto
        .createHmac('sha512', this.secretKey)
        .update(JSON.stringify(payload))
        .digest('hex');

      return signature === expectedSignature;
    } catch (error) {
      console.error('Webhook signature verification error:', error);
      return false;
    }
  }

  // Process webhook
  async processWebhook(payload, signature) {
    try {
      // Verify webhook signature
      if (!this.verifyWebhookSignature(payload, signature)) {
        throw new Error('Invalid webhook signature');
      }

      const event = payload.event;
      const data = payload.data;

      switch (event) {
        case 'charge.success':
          return {
            success: true,
            event: 'payment_successful',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              currency: data.currency,
              status: data.status,
              customer: data.customer,
              metadata: data.metadata,
              paid_at: data.paid_at
            }
          };

        case 'charge.failed':
          return {
            success: true,
            event: 'payment_failed',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              currency: data.currency,
              status: data.status,
              customer: data.customer,
              metadata: data.metadata,
              failure_reason: data.gateway_response
            }
          };

        case 'transfer.success':
          return {
            success: true,
            event: 'transfer_successful',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              currency: data.currency,
              status: data.status,
              recipient: data.recipient
            }
          };

        case 'transfer.failed':
          return {
            success: true,
            event: 'transfer_failed',
            data: {
              reference: data.reference,
              amount: data.amount / 100,
              currency: data.currency,
              status: data.status,
              recipient: data.recipient,
              failure_reason: data.failure_reason
            }
          };

        default:
          return {
            success: true,
            event: 'unknown_event',
            data: payload
          };
      }
    } catch (error) {
      console.error('Webhook processing error:', error);
      return {
        success: false,
        error: error.message || 'Webhook processing failed'
      };
    }
  }

  // Initiate refund
  async initiateRefund(transactionReference, amount, reason = '') {
    try {
      const payload = {
        transaction: transactionReference,
        amount: Math.round(amount * 100), // Convert to kobo
        currency: 'NGN',
        customer_note: reason,
        merchant_note: reason
      };

      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.post(
        `${this.baseURL}/v1/refund`,
        payload,
        { headers }
      );

      if (response.data.status) {
        return {
          success: true,
          data: {
            id: response.data.data.id,
            transaction: response.data.data.transaction,
            amount: response.data.data.amount / 100,
            currency: response.data.data.currency,
            status: response.data.data.status,
            created_at: response.data.data.created_at
          }
        };
      } else {
        throw new Error(response.data.message || 'Refund initiation failed');
      }
    } catch (error) {
      console.error('Moniepoint refund error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Refund initiation failed'
      };
    }
  }

  // Get transaction details
  async getTransaction(reference) {
    try {
      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${this.baseURL}/v1/transaction/${reference}`,
        { headers }
      );

      if (response.data.status) {
        return {
          success: true,
          data: response.data.data
        };
      } else {
        throw new Error(response.data.message || 'Transaction not found');
      }
    } catch (error) {
      console.error('Get transaction error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Transaction not found'
      };
    }
  }

  // List transactions
  async listTransactions(options = {}) {
    try {
      const params = {
        perPage: options.perPage || 50,
        page: options.page || 1,
        customer: options.customer,
        status: options.status,
        from: options.from,
        to: options.to,
        amount: options.amount
      };

      // Remove undefined params
      Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
          delete params[key];
        }
      });

      const headers = {
        'Authorization': `Bearer ${this.secretKey}`,
        'Content-Type': 'application/json'
      };

      const response = await axios.get(
        `${this.baseURL}/v1/transaction`,
        { 
          headers,
          params 
        }
      );

      if (response.data.status) {
        return {
          success: true,
          data: response.data.data,
          meta: response.data.meta
        };
      } else {
        throw new Error(response.data.message || 'Failed to fetch transactions');
      }
    } catch (error) {
      console.error('List transactions error:', error.response?.data || error.message);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch transactions'
      };
    }
  }

  // Calculate transaction fees (if needed)
  calculateFees(amount) {
    // Moniepoint fee structure (example - check current rates)
    const baseAmount = amount;
    let fee = 0;

    if (baseAmount <= 2500) {
      fee = baseAmount * 0.015; // 1.5%
    } else if (baseAmount <= 50000) {
      fee = baseAmount * 0.015;
      if (fee > 2000) fee = 2000; // Cap at ₦20
    } else {
      fee = baseAmount * 0.015;
      if (fee > 2000) fee = 2000; // Cap at ₦20
    }

    return {
      amount: baseAmount,
      fee: Math.round(fee),
      totalAmount: baseAmount + Math.round(fee)
    };
  }
}

module.exports = new MoniepointService();