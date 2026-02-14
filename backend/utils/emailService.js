const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email notification
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.EMAIL_USER) {
      console.log('Email not configured. Would send:', { to, subject });
      return { success: true, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: `"Smart Campus System" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, message: error.message };
  }
};

// Email templates
const emailTemplates = {
  requestCreated: (user, request) => `
    <h2>Service Request Created</h2>
    <p>Hello ${user.name},</p>
    <p>Your service request has been created successfully.</p>
    <p><strong>Request ID:</strong> ${request.requestId}</p>
    <p><strong>Title:</strong> ${request.title}</p>
    <p><strong>Status:</strong> ${request.status}</p>
    <p>We will update you once a technician is assigned.</p>
  `,
  
  requestAssigned: (user, request, technician) => `
    <h2>Request Assigned</h2>
    <p>Hello ${user.name},</p>
    <p>Your request #${request.requestId} has been assigned to ${technician.name}.</p>
    <p><strong>Title:</strong> ${request.title}</p>
    <p>The technician will contact you soon.</p>
  `,
  
  statusUpdated: (user, request) => `
    <h2>Request Status Updated</h2>
    <p>Hello ${user.name},</p>
    <p>Your request #${request.requestId} status has been updated to: <strong>${request.status}</strong></p>
    <p><strong>Title:</strong> ${request.title}</p>
  `,
  
  requestResolved: (user, request) => `
    <h2>Request Resolved</h2>
    <p>Hello ${user.name},</p>
    <p>Your request #${request.requestId} has been resolved.</p>
    <p><strong>Title:</strong> ${request.title}</p>
    <p><strong>Resolution Notes:</strong> ${request.resolutionNotes || 'N/A'}</p>
    <p>Please provide feedback on the service.</p>
  `
};

module.exports = { sendEmail, emailTemplates };