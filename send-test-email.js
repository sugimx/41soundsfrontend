const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.in',
  port: 465,
  secure: true,
  auth: {
    user: 'connect@41sounds.com',
    pass: 'wvA0eh9M661k'
  }
});

const emailAddresses = ['srisitharth239@gmail.com'];
const subject = '🎵 Concert Ticket Booking Confirmation';
const htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    <h2 style="color: #333;">Thank you for your order! 🎉</h2>
    <p>Hi <strong>Customer Name</strong> 🎉</p>
    <p>Your payment has been received and confirmed.</p>
    <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #007bff; border-radius: 5px; margin: 20px 0;">
      <strong>Order ID:</strong> CFPay_test_batch<br>
      <strong>Ticket Category:</strong> Premium<br>
      <strong>Ticket Price:</strong> ₹1152.5<br>
      <strong>Number of Tickets:</strong> 2<br>
      <strong>Total Amount:</strong> ₹2305<br>
      <strong>Date:</strong> ${new Date().toLocaleDateString('en-IN')}<br>
    </div>
    <p>Your booking is being processed, and you will receive your ticket details via email or WhatsApp once the seats are completely booked.</p>
    <p>If you have any questions, please contact our support team.</p>
    <p style="margin-top: 30px; color: #666;">Best regards,<br><strong>41Sounds Team</strong></p>
  </div>
`;

const textContent = `Your payment has been received and confirmed.

Order ID: CFPay_test_batch
Ticket Category: Premium
Ticket Price: ₹1152.5
Number of Tickets: 2
Total Amount: ₹2305
Date: ${new Date().toLocaleDateString('en-IN')}

Your booking is being processed, and you will receive your ticket details via email or WhatsApp once the seats are completely booked.

Best regards,
41Sounds Team`;

async function sendEmails() {
  try {
    for (const email of emailAddresses) {
      const result = await transporter.sendMail({
        from: 'connect@41sounds.com',
        to: email,
        subject: subject,
        html: htmlContent,
        text: textContent
      });
      console.log(`✅ Email sent to ${email} - Message ID: ${result.messageId}`);
    }
    console.log('\n✅ All emails sent successfully!');
    console.log('\n📧 Email includes:');
    console.log('   • Ticket Category: Premium');
    console.log('   • Ticket Price: ₹1152.5');
    console.log('   • Number of Tickets: 2');
    console.log('   • Total Amount: ₹2305');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error sending emails:', error.message);
    process.exit(1);
  }
}

sendEmails();
