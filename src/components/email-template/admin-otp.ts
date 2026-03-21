interface AdminOTPEmailProps {
  otp: string;
  email: string;
}

export const AdminOTPTemplate = ({ otp, email }: AdminOTPEmailProps) => {
  return `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #10b981; text-align: center;">Maarga Developer Access</h2>
      <p>Hello,</p>
      <p>You requested access to the Maarga Developer Back-Door for the account: <strong>${email}</strong>.</p>
      <div style="background-color: #f3f4f6; border-radius: 8px; padding: 30px; text-align: center; margin: 30px 0;">
        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111827;">${otp}</span>
      </div>
      <p style="font-size: 14px; color: #6b7280;">This code will expire in 10 minutes. If you did not request this code, please ignore this email.</p>
      <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 40px 0;">
      <p style="font-size: 12px; color: #9ca3af; text-align: center;">Maarga &bull; Smart Fuel Finder &bull; Developer Portal</p>
    </div>
  `;
};
