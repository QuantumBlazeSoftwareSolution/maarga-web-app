'use server';

import nodemailer from 'nodemailer';
import { AdminOTPTemplate } from '@/src/components/email-template/admin-otp';

export async function sendAdminOtpEmail(email: string, otp: string) {
  // ── DEBUG: Log all SMTP env vars (password masked) ──
  console.log('[EMAIL] ▶ sendAdminOtpEmail() called');
  console.log('[EMAIL] SMTP_HOST   :', process.env.SMTP_HOST);
  console.log('[EMAIL] SMTP_PORT   :', process.env.SMTP_PORT);
  console.log('[EMAIL] SMTP_USER   :', process.env.SMTP_USER);
  console.log('[EMAIL] SMTP_PASS   :', process.env.SMTP_PASS ? '*** (set)' : '(NOT SET)');
  console.log('[EMAIL] SMTP_FROM   :', process.env.SMTP_FROM);
  console.log('[EMAIL] secure flag :', process.env.SMTP_PORT === '465');
  console.log('[EMAIL] recipient   :', email);

  try {
    // ── Create transporter fresh per-call (safer for serverless) ──
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // ── DEBUG: Verify the SMTP connection before sending ──
    console.log('[EMAIL] Verifying SMTP connection...');
    
    // Create a timeout promise to prevent hanging indefinitely
    const verifyPromise = transporter.verify();
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP Verification Timeout (10s)')), 10000)
    );

    try {
      await Promise.race([verifyPromise, timeoutPromise]);
      console.log('[EMAIL] ✅ SMTP connection verified successfully');
    } catch (vError) {
      console.error('[EMAIL] ❌ SMTP Verification failed/timed out:');
      console.error(JSON.stringify(vError, null, 2));
      if (vError instanceof Error) {
        console.error('[EMAIL] Message:', vError.message);
        console.error('[EMAIL] Stack:', vError.stack);
      }
      // We'll try to send anyway as a fallback, but log the failure
    }

    const htmlContent = AdminOTPTemplate({ otp, email });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"Maarga Support" <maarga.app.lk@gmail.com>',
      to: email,
      subject: 'Maarga Admin Access Code',
      html: htmlContent,
    };

    console.log('[EMAIL] Sending email to:', email);
    const sendPromise = transporter.sendMail(mailOptions);
    const sendTimeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('SMTP Send Timeout (15s)')), 15000)
    );

    const info = await Promise.race([sendPromise, sendTimeoutPromise]) as any;
    console.log('[EMAIL] ✅ Message sent successfully! MessageID:', info.messageId);
    console.log('[EMAIL] Response:', info.response);

    return { success: true };
  } catch (error: unknown) {
    console.error('[EMAIL] ❌ FAILED to send email:');
    console.error(JSON.stringify(error, null, 2));
    if (error instanceof Error) {
      console.error('[EMAIL] Error name   :', error.name);
      console.error('[EMAIL] Error message:', error.message);
      console.error('[EMAIL] Error stack  :', error.stack);
      // Nodemailer-specific fields
      const smtpError = error as Error & { code?: string; command?: string; response?: string; responseCode?: number };
      if (smtpError.code)         console.error('[EMAIL] SMTP code    :', smtpError.code);
      if (smtpError.command)      console.error('[EMAIL] SMTP command :', smtpError.command);
      if (smtpError.response)     console.error('[EMAIL] SMTP response:', smtpError.response);
      if (smtpError.responseCode) console.error('[EMAIL] Response code:', smtpError.responseCode);
    } else {
      console.error('[EMAIL] Unknown error:', error);
    }
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
