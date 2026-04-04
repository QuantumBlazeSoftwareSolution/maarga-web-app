export const AdminOTPTemplate = ({
  otp,
  email,
}: {
  otp: string;
  email: string;
}) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Maarga Admin Access Code</title>
      </head>
      <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 500px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04); border: 1px solid #f1f5f9;">
                
                <!-- Brand Header -->
                <tr>
                  <td style="background: linear-gradient(135deg, #0DB368 0%, #10b981 100%); padding: 45px 40px 35px; text-align: center;">
                    <div style="margin-bottom: 20px;">
                       <img src="https://maarga-lk.vercel.app/MaargaLogo.png" alt="Maarga" style="height: 60px; width: auto; display: inline-block;" />
                    </div>
                    <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">Maarga</h1>
                    <p style="color: rgba(255, 255, 255, 0.85); margin: 6px 0 0; font-size: 12px; font-weight: 600; letter-spacing: 1px; text-transform: uppercase;">Security Verification</p>
                  </td>
                </tr>

                <!-- Content Body -->
                <tr>
                  <td style="padding: 40px;">
                    <p style="margin: 0 0 12px; color: #64748b; font-size: 14px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.05em;">Security Verification</p>
                    <h2 style="margin: 0 0 24px; color: #0f172a; font-size: 20px; font-weight: 700; line-height: 1.3;">Confirm your identity to continue to the admin portal.</h2>
                    
                    <p style="margin: 0 0 28px; color: #475569; font-size: 15px; line-height: 1.6;">
                      Use the following one-time password to verify your access for <span style="color: #0f172a; font-weight: 600;">${email}</span>.
                    </p>

                    <!-- OTP Code Box -->
                    <div style="background-color: #f0fdf4; border: 2px dashed #bbf7d0; border-radius: 14px; padding: 32px; text-align: center; margin-bottom: 28px;">
                      <div style="color: #059669; font-size: 42px; font-weight: 800; letter-spacing: 12px; font-family: 'Courier New', Courier, monospace;">
                        ${otp}
                      </div>
                    </div>

                    <!-- Security Alert Badge -->
                    <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fffbeb; border-left: 4px solid #f59e0b; border-radius: 8px;">
                      <tr>
                        <td style="padding: 12px 16px;">
                          <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
                            <strong>Security Tip:</strong> This code will expire in <strong>10 minutes</strong>. Never share this code with anyone, including Maarga support.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding: 0 40px 40px; text-align: center;">
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                      If you did not request this code, you can safely ignore this email.
                    </p>
                    <div style="margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 24px;">
                      <p style="margin: 0; color: #cbd5e1; font-size: 11px; font-weight: 500;">
                        &copy; ${new Date().getFullYear()} MAARGA SMART FUEL FINDER • SRI LANKA
                      </p>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
};
