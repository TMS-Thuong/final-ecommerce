import { BASE_URL, CLIENT_URL } from '@app/config/env';

export const getVerificationEmail = (firstName: string | null, token: string): { subject: string; html: string } => {
  return {
    subject: 'Verify Your Email',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center;">Hello ${firstName},</h2>
            <p style="color: #555;">Thank you for registering on our personal blog. To complete your registration and activate your account, please click the link below:</p>
            <p style="text-align: center;">
              <a href="${BASE_URL}/user/api/auth/verify-email?token=${token}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Verify Account</a>
            </p>
            <p style="color: #555;">If you cannot click the link, please copy and paste it into your browser’s address bar.</p>
            <p style="color: #555;">This verification link will expire in 24 hours. If the link expires, you will need to request a new verification link.</p>
            <p style="color: #555;">If you did not register for an account, please ignore this email.</p>
            <p style="color: #555; font-size: 12px; margin-top: 20px;">Thank you!</p>
          </div>
        </body>
      </html>
    `,
  };
};

export const getResetPasswordEmail = (firstName: string, token: string): { subject: string; html: string } => {
  return {
    subject: 'Password Reset Request',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Hello ${firstName},</h2>
            <p style="color: #555;">You have requested to reset your password. To create a new password, please click the link below:</p>
            <p style="text-align: center;">
              <a href="${CLIENT_URL}/user/reset-password/${token}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a>
            </p>
            <p style="color: #555;">This link will expire in 30 minutes.</p>
            <p style="color: #555;">If you did not request a password reset, please ignore this email.</p>
            <p style="color: #555; font-size: 12px; margin-top: 20px;">Thank you!</p>
          </div>
        </body>
      </html>
    `,
  };
};
