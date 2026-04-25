import { NextRequest, NextResponse } from 'next/server';

// Types for Cashfree webhook payload
interface CustomerDetails {
  customer_phone: string;
  customer_email: string;
  customer_name: string;
  customer_fields?: Array<{ title: string; value: string }>;
}

interface OrderData {
  order_amount: number;
  order_id: string;
  order_status: string;
  transaction_id: number;
  customer_details: CustomerDetails;
  amount_details?: Array<{ title: string; value: number; quantity?: number; selectedoption?: string }>;
}

interface CashfreeWebhookPayload {
  data: {
    form?: { form_id: string; cf_form_id: number; form_url: string; form_currency: string };
    order: OrderData;
  };
  event_time: string;
  type: string;
}

// Allowed forms - only send messages for these forms
const ALLOWED_FORMS = [
  'https://payments.cashfree.com/forms/darkpink2000',
  'https://payments.cashfree.com/forms/naviblue1100',
  'https://payments.cashfree.com/forms/white600',
  'https://payments.cashfree.com/forms/gold800',
  'https://payments.cashfree.com/forms/specialvip',
];

// Ticket category mapping
const TICKET_CATEGORIES = {
  'https://payments.cashfree.com/forms/darkpink2000': { category: 'VIP', price: 2052.5 },
  'https://payments.cashfree.com/forms/naviblue1100': { category: 'Premium', price: 1152.5 },
  'https://payments.cashfree.com/forms/white600': { category: 'General', price: 652.5 },
  'https://payments.cashfree.com/forms/gold800': { category: 'Gold', price: 852.5 },
  'https://payments.cashfree.com/forms/specialvip': { category: 'Special VIP', price: 5052.5 },
};

interface WhatsAppTemplateParam {
  type: 'text';
  text: string;
}

interface WhatsAppRequestBody {
  messaging_product: 'whatsapp';
  to: string;
  type: 'template';
  template: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: 'body';
      parameters: WhatsAppTemplateParam[];
    }>;
  };
}

// Utility function to format phone number to 91XXXXXXXXXX format
function formatPhoneNumber(phone: string): string {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If already starts with 91, return as is
  if (cleaned.startsWith('91')) {
    return cleaned;
  }
  
  // If 10 digits, prepend 91
  if (cleaned.length === 10) {
    return `91${cleaned}`;
  }
  
  // If starts with 0, remove it and prepend 91
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `91${cleaned.slice(1)}`;
  }
  
  // Return as-is if already in correct format or cannot determine
  return cleaned;
}

// Utility function to send email
async function sendEmail(
  customerName: string,
  customerEmail: string,
  orderId: string,
  orderAmount?: number,
  ticketCategory?: string,
  numberOfTickets?: number,
  singleTicketPrice?: number
): Promise<void> {
  const emailService = process.env.EMAIL_SERVICE || 'gmail'; // 'gmail', 'mailgun', 'resend', or 'smtp'
  
  if (!customerEmail) {
    throw new Error('Customer email not provided');
  }

  // Email content
  const subject = `🎵 Concert Ticket Booking Confirmation: ${orderId}`;
  const ticketInfo = ticketCategory && numberOfTickets && singleTicketPrice
    ? `<p><strong>Ticket Category:</strong> ${ticketCategory}</p>
       <p><strong>Ticket Price:</strong> ₹${singleTicketPrice}</p>
       <p><strong>Number of Tickets:</strong> ${numberOfTickets}</p>
       <p><strong>Total Amount:</strong> ₹${orderAmount}</p>` 
    : '';
  
  const htmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #2c3e50;">Thank you for your order!</h2>
          
          <p>Hi <strong>${customerName}</strong> 🎉</p>
          
          <p>Please be informed that your payment has been successfully received and confirmed.</p>

          <p>Thank you for booking your ${ticketCategory} tickets for our upcoming Muthamazhai 2.0 event on 16 May 2026 at Karthipuram, Neelambur, Coimbatore at 6:30 PM.</p>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #007bff; margin: 20px 0;">
            <p><strong>Order ID:</strong> ${orderId}</p>
            ${ticketInfo}
            <p><strong>Booking Date:</strong> ${new Date().toLocaleDateString('en-IN')}</p>
          </div>
          
          <p>Your booking is being processed, and you will receive your ticket details via email/whatsapp anytime before the event.</p>
          
          <p>We look forward to hosting you for an unforgettable evening of music and entertainment.</p>
          
          <p>Best Regards,<br><strong>Team 41Sounds</strong></p>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
          <p style="font-size: 12px; color: #999;">This is an automated email. Please do not reply directly to this email.</p>
        </div>
      </body>
    </html>
  `;

  const ticketTextInfo = ticketCategory && numberOfTickets && singleTicketPrice
    ? `Ticket Category: ${ticketCategory}\n    Ticket Price: ₹${singleTicketPrice}\n    Number of Tickets: ${numberOfTickets}\n    Total Amount: ₹${orderAmount}\n    ` 
    : '';
  
  const textContent = `
    Thank you for your order!
    
    Hi ${customerName},
    
    Please be informed that your payment has been successfully received and confirmed.

    Thank you for booking your ${ticketCategory} tickets for our upcoming Muthamazhai 2.0 event on 16 May 2026 at Karthipuram, Neelambur, Coimbatore at 6:30 PM.
    
    Order ID: ${orderId}
    ${ticketTextInfo}
    Booking Date: ${new Date().toLocaleDateString('en-IN')}
    
    Your booking is being processed, and you will receive your ticket details via email/whatsapp anytime before the event.
    
    We look forward to hosting you for an unforgettable evening of music and entertainment.
    
    Best Regards,
    Team 41Sounds
  `;

  try {
    if (emailService === 'resend') {
      // Using Resend API (npm install resend)
      try {
      const { Resend } = require('resend');
      const resend = new Resend(process.env.RESEND_API_KEY);
      
      await resend.emails.send({
        from: process.env.EMAIL_FROM || 'noreply@example.com',
        to: customerEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
      });
         } catch (moduleError) {
        console.warn('⚠️ Resend module not installed. Install with: npm install resend');
        console.error('Email service error:', moduleError);
      }
    } else if (emailService === 'smtp' || emailService === 'gmail') {
      // Using Nodemailer (npm install nodemailer)
      const nodemailer = require('nodemailer');
      
      let transporter;
      
      if (emailService === 'smtp') {
        // Generic SMTP (Zoho Mail, AWS SES, etc.)
        transporter = nodemailer.createTransport({
          host: process.env.EMAIL_HOST,
          port: parseInt(process.env.EMAIL_PORT || '465'),
          secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
          },
        });
      } else {
        // Gmail specific
        transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD, // Gmail App Password
          },
        });
      }

      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: customerEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
      });
    } else if (emailService === 'mailgun') {
      // Using Mailgun API
       try {
      const mailgun = require('mailgun.js');
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
      });

      await mg.messages.create(process.env.MAILGUN_DOMAIN, {
        from: process.env.EMAIL_FROM || `noreply@${process.env.MAILGUN_DOMAIN}`,
        to: customerEmail,
        subject: subject,
        html: htmlContent,
        text: textContent,
      });
           } catch (moduleError) {
        console.warn('⚠️ Mailgun.js module not installed. Install with: npm install mailgun.js');
        console.error('Email service error:', moduleError);
      }
    } else {
      throw new Error(`Unknown email service: ${emailService}`);
    }

    console.log('📧 Email sent successfully:', {
      to: customerEmail,
      orderId: orderId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('❌ Email service error:', error);
    throw error;
  }
}

// Utility function to send WhatsApp message
async function sendWhatsAppMessage(
  customerName: string,
  orderId: string,
  phoneNumber: string,
  orderAmount: string | number,
  ticketCategory?: string
): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!accessToken || !phoneNumberId) {
    throw new Error('WhatsApp credentials not configured');
  }

  const formattedPhone = formatPhoneNumber(phoneNumber);
  
  if (!/^\d{12,13}$/.test(formattedPhone)) {
    throw new Error(`Invalid phone number format: ${formattedPhone}`);
  }

  // Format booking date as DD MMM YYYY
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const requestBody: WhatsAppRequestBody = {
    messaging_product: 'whatsapp',
    to: formattedPhone,
    type: 'template',
    template: {
      name: 'payment_confirmation_3',
      language: {
        code: 'en_US',
      },
      components: [
        {
          type: 'body',
          parameters: [
            {
              type: 'text',
              text: customerName,
            },
            {
              type: 'text',
              text: ticketCategory || 'Concert Ticket',
            },
            {
              type: 'text',
              text: orderId,
            },
            {
              type: 'text',
              text: formattedDate,
            },
            {
              type: 'text',
              text: String(orderAmount),
            },
          ],
        },
      ],
    },
  };

  const url = `https://graph.facebook.com/v25.0/${phoneNumberId}/messages`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(
      `WhatsApp API error: ${response.status} - ${JSON.stringify(errorData)}`
    );
  }

  const data = await response.json();
  const messageId = data?.messages?.[0]?.id;
  console.log('WhatsApp message sent successfully:', {
    messageId,
    phone: formattedPhone,
    timestamp: new Date().toISOString(),
  });
}

// Placeholder function for Cashfree webhook signature verification
function verifyCashfreeSignature(
  payload: string,
  signature: string,
  secretKey: string
): boolean {
  // TODO: Implement Cashfree signature verification
  // Reference: https://docs.cashfree.com/docs/webhooks
  // Use HMAC-SHA256 to verify the signature
  // This is a placeholder - uncomment and implement when ready:
  
  /*
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secretKey)
    .update(payload)
    .digest('base64');
  return signature === expectedSignature;
  */
  
  console.warn('⚠️  Webhook signature verification not implemented');
  return true; // Remove this in production after implementing verification
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    // Log incoming request
    console.log('📨 Cashfree webhook received');

    // Parse request body
    let payload: CashfreeWebhookPayload;
    try {
      payload = await request.json();
    } catch {
      console.error('❌ Failed to parse JSON payload');
      return NextResponse.json(
        { success: false, error: 'Invalid JSON payload' },
        { status: 200 } // Return 200 to prevent Cashfree retries
      );
    }

    // Validate required structure
    if (!payload.data?.order) {
      console.error('❌ Missing data.order in payload');
      return NextResponse.json(
        { success: false, error: 'Invalid payload structure' },
        { status: 200 }
      );
    }

    const order = payload.data.order;
    const customerDetails = order.customer_details;

    // Validate required fields
    const requiredFields = ['order_id', 'order_status', 'customer_details'];
    const missingFields = requiredFields.filter((field) => {
      if (field === 'customer_details') {
        return !customerDetails || !customerDetails.customer_name || !customerDetails.customer_phone;
      }
      return !order[field as keyof OrderData];
    });

    if (missingFields.length > 0) {
      console.error(`❌ Missing required fields: ${missingFields.join(', ')}`);
      return NextResponse.json(
        { success: false, error: `Missing fields: ${missingFields.join(', ')}` },
        { status: 200 }
      );
    }

    // Verify payment status (Cashfree uses "PAID" for successful payments)
    if (order.order_status !== 'PAID') {
      console.log(`⏭️  Payment not successful. Status: ${order.order_status}`);
      return NextResponse.json(
        { success: true, message: 'Payment not successful, no action taken' },
        { status: 200 }
      );
    }

    console.log(`✅ Payment successful for order: ${order.order_id}`);

    // Check if this form is in the allowed list
    const formUrl = payload.data.form?.form_url;
    const isAllowedForm = ALLOWED_FORMS.includes(formUrl || '');
    
    if (!isAllowedForm) {
      console.log(`⏭️  Form ${formUrl} not in allowed list. Skipping notifications.`);
      return NextResponse.json(
        { success: true, message: 'Payment successful but form not in allowed list' },
        { status: 200 }
      );
    }

    console.log(`✅ Form is allowed: ${formUrl}`);

    // Extract required data
    const customer_name = customerDetails.customer_name;
    const customer_phone = customerDetails.customer_phone;
    const customer_email = customerDetails.customer_email;
    const order_id = order.order_id;
    const order_amount = order.order_amount;

    console.log(`📤 Preparing to send notifications to ${customer_phone} and ${customer_email}`);

    // Get ticket category and calculate number of tickets
    const ticketInfo = TICKET_CATEGORIES[formUrl as keyof typeof TICKET_CATEGORIES];
    const ticketCategory = ticketInfo?.category;
    const singleTicketPrice = ticketInfo?.price;
    const numberOfTickets = ticketInfo ? Math.round(order_amount / ticketInfo.price) : undefined;

    // Send WhatsApp message
    try {
      await sendWhatsAppMessage(customer_name, order_id, customer_phone, order_amount, ticketCategory);
      console.log(`✅ WhatsApp message sent successfully for order: ${order_id}`);
    } catch (whatsappError) {
      console.error('❌ WhatsApp API error:', whatsappError);
      // Log the error but still return 200 to Cashfree
    }

    // Send Email
    try {
      await sendEmail(customer_name, customer_email, order_id, order_amount, ticketCategory, numberOfTickets, singleTicketPrice);
      console.log(`✅ Email sent successfully for order: ${order_id}`);
    } catch (emailError) {
      console.error('❌ Email service error:', emailError);
      // Log the error but still return 200 to Cashfree
    }

    // Log successful processing
    console.log(`✅ Webhook processed successfully for order: ${order_id}`);

    // Always return 200 to Cashfree to prevent retries
    return NextResponse.json(
      {
        success: true,
        message: 'Webhook processed successfully',
        order_id: order_id,
      },
      { status: 200 }
    );
  } catch (error) {
    // Log unexpected errors
    console.error('❌ Unexpected error in webhook handler:', error);

    // Return 200 to prevent Cashfree retries
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 200 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
