'use server';

import { AdminOTPTemplate } from '@/src/components/email-template/admin-otp';
import nodemailer from 'nodemailer';

export async function sendAdminOtpEmail(email: string, otp: string) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const htmlContent = AdminOTPTemplate({ otp, email });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Maarga Support" <maarga.app.lk@gmail.com>',
      to: email,
      subject: 'Maarga Admin Access Code',
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Message sent: %s', info.messageId);

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
