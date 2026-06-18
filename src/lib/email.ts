import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
    console.warn('SMTP not configured, skipping email delivery.');
    console.log(`[EMAIL SIMULATION] To: ${to} | Subject: ${subject}`);
    return true;
  }

  try {
    const info = await transporter.sendMail({
      from: `"OTO STORE" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Message sent: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
