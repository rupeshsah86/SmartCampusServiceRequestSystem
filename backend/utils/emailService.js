const nodemailer = require('nodemailer');

// Create transporter with fallback to Ethereal for testing
let transporter;

const createTransporter = async () => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    // Use provided SMTP
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT) || 587,
      secure: parseInt(process.env.EMAIL_PORT) === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  } else {
    // Use Ethereal for testing (fake SMTP)
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log('📧 Using Ethereal test email account');
  }
  return transporter;
};

// Send email notification
const sendEmail = async (to, subject, html) => {
  try {
    if (!transporter) {
      await createTransporter();
    }

    if (!process.env.EMAIL_USER) {
      console.log('📧 Email not configured. Would send:', { to, subject });
      return { success: true, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"Smart Campus System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent to:', to);
    
    // If using Ethereal, show preview URL
    if (info.messageId && !process.env.EMAIL_USER) {
      console.log('📬 Preview URL:', nodemailer.getTestMessageUrl(info));
    }
    
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('❌ Email error:', error.message);
    return { success: false, message: error.message };
  }
};

// Email template wrapper
const emailWrapper = (content) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
    .button { display: inline-block; background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
    .info-box { background: white; padding: 15px; border-left: 4px solid #6366f1; margin: 15px 0; border-radius: 5px; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏫 Smart Campus System</h1>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>This is an automated email from Smart Campus Service Request System.</p>
      <p>© 2025 Smart Campus. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
`;

// Email templates
const emailTemplates = {
  requestCreated: (user, request) => emailWrapper(`
    <h2>✅ Service Request Created Successfully</h2>
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Your service request has been created and submitted successfully.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Category:</strong> ${request.category.replace('_', ' ').toUpperCase()}</p>
      <p><strong>Priority:</strong> ${request.priority.toUpperCase()}</p>
      <p><strong>Status:</strong> PENDING</p>
      <p><strong>Location:</strong> ${request.location}</p>
    </div>
    <p>We will notify you once a technician is assigned to your request.</p>
    <p>You can track your request status anytime from your dashboard.</p>
  `),
  
  requestAssigned: (user, request, technician) => emailWrapper(`
    <h2>👤 Technician Assigned to Your Request</h2>
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Good news! A technician has been assigned to your service request.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Assigned To:</strong> ${technician.name}</p>
      <p><strong>Department:</strong> ${technician.department}</p>
      <p><strong>Status:</strong> IN PROGRESS</p>
    </div>
    <p>The technician will start working on your request shortly and may contact you if needed.</p>
  `),
  
  statusUpdated: (user, request, oldStatus) => emailWrapper(`
    <h2>🔄 Request Status Updated</h2>
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Your service request status has been updated.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Previous Status:</strong> ${oldStatus.toUpperCase()}</p>
      <p><strong>New Status:</strong> ${request.status.toUpperCase()}</p>
    </div>
    <p>Check your dashboard for more details and updates.</p>
  `),
  
  requestResolved: (user, request) => emailWrapper(`
    <h2>✅ Request Resolved - Action Required</h2>
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Great news! Your service request has been marked as resolved by the technician.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Resolution Notes:</strong> ${request.resolutionNotes || 'N/A'}</p>
    </div>
    <p><strong>Action Required:</strong> Please review the resolution and confirm:</p>
    <ul>
      <li>✅ <strong>Accept</strong> if the issue is resolved</li>
      <li>❌ <strong>Reject</strong> if the issue persists</li>
    </ul>
    <p>After accepting, you can provide feedback to help us improve our services.</p>
  `),

  requestReopened: (technician, request, user) => emailWrapper(`
    <h2>🔄 Request Reopened</h2>
    <p>Hello <strong>${technician.name}</strong>,</p>
    <p>A request you resolved has been reopened by the user.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Submitted By:</strong> ${user.name}</p>
      <p><strong>Status:</strong> REOPENED</p>
    </div>
    <p>Please review the request and work on resolving the remaining issues.</p>
  `),

  requestClosed: (user, request) => emailWrapper(`
    <h2>🎉 Request Closed Successfully</h2>
    <p>Hello <strong>${user.name}</strong>,</p>
    <p>Your service request has been closed successfully.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Title:</strong> ${request.title}</p>
      <p><strong>Resolution Time:</strong> ${request.resolutionTime ? formatTime(request.resolutionTime) : 'N/A'}</p>
      <p><strong>Status:</strong> CLOSED</p>
    </div>
    <p>Thank you for using Smart Campus Service Request System!</p>
    <p>If you have any feedback, please let us know.</p>
  `),

  feedbackReceived: (technician, request, feedback) => emailWrapper(`
    <h2>⭐ Feedback Received</h2>
    <p>Hello <strong>${technician.name}</strong>,</p>
    <p>You received feedback for a resolved request.</p>
    <div class="info-box">
      <p><strong>Request ID:</strong> ${request.requestId}</p>
      <p><strong>Overall Rating:</strong> ${'⭐'.repeat(feedback.rating)} (${feedback.rating}/5)</p>
      <p><strong>Service Quality:</strong> ${feedback.serviceQuality}/5</p>
      <p><strong>Response Time:</strong> ${feedback.responseTime}/5</p>
      <p><strong>Satisfaction:</strong> ${feedback.overallSatisfaction}/5</p>
      ${feedback.comments ? `<p><strong>Comments:</strong> "${feedback.comments}"</p>` : ''}
    </div>
    <p>Keep up the great work!</p>
  `)
};

// Helper function to format time
const formatTime = (milliseconds) => {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 24) {
    const days = Math.floor(hours / 24);
    const remainingHours = hours % 24;
    return `${days}d ${remainingHours}h`;
  }
  
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

module.exports = { sendEmail, emailTemplates };