/**
 * Testing utilities and examples for Cashfree Webhook
 * Use these for local development and debugging
 */

// ============================================
// EXAMPLE 1: Successful Payment Webhook (REAL CASHFREE FORMAT)
// ============================================
const successfulPaymentExample = {
  data: {
    form: {
      form_id: "concert-form-1",
      cf_form_id: 2011640,
      form_url: "https://payments.cashfree.com/forms/concert-tickets",
      form_currency: "INR",
    },
    order: {
      order_amount: 999,
      order_id: "CFPay_concert_user_123",
      order_status: "PAID", // ✅ Key: Status must be "PAID" for successful payments
      transaction_id: 1021206,
      customer_details: {
        customer_phone: "9876543210", // Will be auto-formatted to 919876543210
        customer_email: "user@example.com",
        customer_name: "John Doe",
        customer_fields: [
          {
            title: "Event Date",
            value: "2026-04-25",
          },
        ],
      },
      amount_details: [
        {
          title: "Concert Ticket",
          value: 999,
          quantity: 1,
        },
      ],
    },
  },
  event_time: "2026-04-14T14:10:36+05:30",
  type: "PAYMENT_FORM_ORDER_WEBHOOK",
};

// ============================================
// EXAMPLE 2: Failed Payment Webhook
// ============================================
const failedPaymentExample = {
  data: {
    form: {
      form_id: "concert-form-1",
      cf_form_id: 2011640,
      form_url: "https://payments.cashfree.com/forms/concert-tickets",
      form_currency: "INR",
    },
    order: {
      order_amount: 999,
      order_id: "CFPay_concert_user_456",
      order_status: "FAILED", // ❌ Payment failed
      transaction_id: null,
      customer_details: {
        customer_phone: "9876543211",
        customer_email: "user2@example.com",
        customer_name: "Priya Singh",
      },
    },
  },
  event_time: "2026-04-14T15:30:36+05:30",
  type: "PAYMENT_FORM_ORDER_WEBHOOK",
};

// ============================================
// EXAMPLE 3: Pending Payment Webhook
// ============================================
const pendingPaymentExample = {
  data: {
    form: {
      form_id: "concert-form-1",
      cf_form_id: 2011640,
      form_url: "https://payments.cashfree.com/forms/concert-tickets",
      form_currency: "INR",
    },
    order: {
      order_amount: 1999,
      order_id: "CFPay_concert_user_789",
      order_status: "PENDING", // ⏳ Still pending
      transaction_id: null,
      customer_details: {
        customer_phone: "09876543212",
        customer_email: "user3@example.com",
        customer_name: "Arjun Patel",
      },
    },
  },
  event_time: "2026-04-14T16:30:36+05:30",
  type: "PAYMENT_FORM_ORDER_WEBHOOK",
};

// ============================================
// BROWSER CONSOLE TEST FUNCTION
// ============================================
async function testWebhook(payload = successfulPaymentExample) {
  try {
    const response = await fetch("/api/webhook", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log("Response Status:", response.status);
    console.log("Response Data:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }
}

// ============================================
// NODE.JS TEST SCRIPT
// ============================================
/*
Run with: node webhook-test.js

Install axios: npm install axios

const axios = require('axios');

async function testWebhookLocal() {
  const payload = {
    data: {
      form: {
        form_id: "concert-form-1",
        cf_form_id: 2011640,
        form_url: "https://payments.cashfree.com/forms/concert-tickets",
        form_currency: "INR",
      },
      order: {
        order_amount: 999,
        order_id: "CFPay_concert_user_123",
        order_status: "PAID",
        transaction_id: 1021206,
        customer_details: {
          customer_phone: "9876543210",
          customer_email: "user@example.com",
          customer_name: "John Doe",
        },
      },
    },
    event_time: "2026-04-14T14:10:36+05:30",
    type: "PAYMENT_FORM_ORDER_WEBHOOK",
  };

  try {
    const response = await axios.post(
      'http://localhost:3000/api/webhook',
      payload,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testWebhookLocal();
*/

// ============================================
// CURL COMMANDS FOR TESTING
// ============================================
/*

# Test Successful Payment (Local)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "form": {
        "form_id": "concert-form-1",
        "cf_form_id": 2011640,
        "form_url": "https://payments.cashfree.com/forms/concert-tickets",
        "form_currency": "INR"
      },
      "order": {
        "order_amount": 999,
        "order_id": "CFPay_test_123",
        "order_status": "PAID",
        "transaction_id": 1021206,
        "customer_details": {
          "customer_phone": "9876543210",
          "customer_email": "user@example.com",
          "customer_name": "John Doe"
        }
      }
    },
    "event_time": "2026-04-14T14:10:36+05:30",
    "type": "PAYMENT_FORM_ORDER_WEBHOOK"
  }'

# Test Successful Payment (Vercel)
curl -X POST https://your-domain.vercel.app/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "order": {
        "order_id": "CFPay_test_456",
        "order_status": "PAID",
        "customer_details": {
          "customer_phone": "9876543210",
          "customer_email": "user@example.com",
          "customer_name": "John Doe"
        }
      }
    },
    "type": "PAYMENT_FORM_ORDER_WEBHOOK"
  }'

# Test Failed Payment (No WhatsApp message sent)
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "order": {
        "order_id": "CFPay_test_789",
        "order_status": "FAILED",
        "customer_details": {
          "customer_phone": "9876543211",
          "customer_email": "user2@example.com",
          "customer_name": "Priya Singh"
        }
      }
    },
    "type": "PAYMENT_FORM_ORDER_WEBHOOK"
  }'

# Test Missing Required Fields
curl -X POST http://localhost:3000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "order": {
        "order_id": "CFPay_test_101"
      }
    },
    "type": "PAYMENT_FORM_ORDER_WEBHOOK"
  }'

*/

// ============================================
// PHONE NUMBER FORMAT TESTS
// ============================================
function testPhoneFormats() {
  const testCases = [
    { input: "9876543210", expected: "919876543210" },
    { input: "919876543210", expected: "919876543210" },
    { input: "09876543210", expected: "919876543210" },
    { input: "+919876543210", expected: "919876543210" },
    { input: "+91 98765 43210", expected: "919876543210" },
    { input: "98765-43210", expected: "919876543210" },
  ];

  console.log("Phone Format Tests:");
  testCases.forEach(({ input, expected }) => {
    const result = formatPhoneNumber(input);
    const status = result === expected ? "✅ PASS" : "❌ FAIL";
    console.log(`${status} | Input: ${input} | Expected: ${expected} | Got: ${result}`);
  });
}

// Helper function (same as in route.ts)
function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("91")) return cleaned;
  if (cleaned.length === 10) return `91${cleaned}`;
  if (cleaned.startsWith("0") && cleaned.length === 11) {
    return `91${cleaned.slice(1)}`;
  }
  return cleaned;
}

// ============================================
// INTEGRATION TEST EXAMPLE
// ============================================
/*
Place this in __tests__/webhook.test.ts and run: npm test

import { POST } from '@/app/api/webhook/route';
import { NextRequest } from 'next/server';

describe('Webhook API', () => {
  it('should process successful payment', async () => {
    const payload = {
      data: {
        order: {
          order_id: 'CFPay_test_123',
          order_status: 'PAID',
          customer_details: {
            customer_phone: '9876543210',
            customer_email: 'test@example.com',
            customer_name: 'Test User',
          },
        },
      },
      type: 'PAYMENT_FORM_ORDER_WEBHOOK',
    };

    const request = new NextRequest('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.order_id).toBe('CFPay_test_123');
  });

  it('should reject non-successful payments', async () => {
    const payload = {
      data: {
        order: {
          order_id: 'CFPay_test_456',
          order_status: 'FAILED',
          customer_details: {
            customer_phone: '9876543210',
            customer_email: 'test@example.com',
            customer_name: 'Test User',
          },
        },
      },
      type: 'PAYMENT_FORM_ORDER_WEBHOOK',
    };

    const request = new NextRequest('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain('not successful');
  });

  it('should return 200 for missing fields', async () => {
    const payload = {
      data: {
        order: {
          order_id: 'CFPay_test_789',
        },
      },
      type: 'PAYMENT_FORM_ORDER_WEBHOOK',
    };

    const request = new NextRequest('http://localhost:3000/api/webhook', {
      method: 'POST',
      body: JSON.stringify(payload),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);
  });
});
*/

// ============================================
// WEBHOOK PAYLOAD STRUCTURE REFERENCE
// ============================================
const payloadStructureReference = {
  required: {
    "data.order.order_id": "Unique order ID from Cashfree",
    "data.order.order_status": "Payment status - must be 'PAID' for successful",
    "data.order.customer_details.customer_name": "Customer name",
    "data.order.customer_details.customer_phone": "Customer phone (10 or 12 digits)",
  },
  optional: {
    "data.form": "Form information (form_id, cf_form_id, form_url, form_currency)",
    "data.order.order_amount": "Order amount",
    "data.order.transaction_id": "Cashfree transaction ID",
    "data.order.customer_details.customer_email": "Customer email",
    "data.order.customer_details.customer_fields": "Custom fields",
    "data.order.amount_details": "Breakdown of charges",
    "event_time": "Webhook event timestamp",
  },
  paymentStatuses: {
    "PAID": "✅ Successful - WhatsApp message will be sent",
    "FAILED": "❌ Payment failed - No action taken",
    "PENDING": "⏳ Payment pending - No action taken",
  },
};

export {
  successfulPaymentExample,
  failedPaymentExample,
  pendingPaymentExample,
  testWebhook,
  testPhoneFormats,
  payloadStructureReference,
};
