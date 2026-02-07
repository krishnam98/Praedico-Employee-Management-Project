import nodemailer from 'nodemailer';

export const sendEmail = async (options) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_PORT == 465, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  console.log(`Attempting to send email via Nodemailer for: ${options.email}`);

  const fromName = process.env.EMAIL_FROM_NAME || "Employee Management";
  const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER;

  const mailOptions = {
    from: `"${fromName}" <${fromEmail}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error(`Detailed Email Error (Nodemailer): ${error.message}`);
    throw error;
  }
};
