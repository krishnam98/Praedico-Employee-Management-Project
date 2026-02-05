import nodemailer from "nodemailer";

export const sendEmail = async (options) => {
  console.log(`Attempting to send email via: ${process.env.EMAIL_HOST}:${process.env.EMAIL_PORT} (Secure: ${process.env.EMAIL_PORT == 465})`);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: Number(process.env.EMAIL_PORT) === 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    },
    connectionTimeout: 10000, // 10 seconds timeout
    greetingTimeout: 10000,
    socketTimeout: 10000,
  });

  const fromName = process.env.EMAIL_FROM_NAME || "Praedico Admin";
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
    console.error(`Detailed Email Error: ${error.message}`);
    throw error;
  }
};
