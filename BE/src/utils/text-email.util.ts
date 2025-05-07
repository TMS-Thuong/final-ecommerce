import { BASE_URL, CLIENT_URL } from '@app/config/env';

export const getVerificationEmail = (firstName: string | null, token: string): { subject: string; html: string } => {
  return {
    subject: 'Xác thực email của bạn',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333; text-align: center;">Xin chào ${firstName},</h2>
            <p style="color: #555;">Cảm ơn bạn đã đăng ký tài khoản trên blog cá nhân. Để hoàn tất quá trình đăng ký và kích hoạt tài khoản của bạn, vui lòng nhấp vào liên kết bên dưới:</p>
            <p style="text-align: center;">
              <a href="${BASE_URL}/user/api/auth/verify-email?token=${token}" style="background-color: #007bff; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Xác thực tài khoản</a>
            </p>
            <p style="color: #555;">Nếu bạn không thể nhấp vào liên kết, hãy sao chép và dán liên kết vào thanh địa chỉ của trình duyệt.</p>
            <p style="color: #555;">Liên kết xác minh này sẽ hết hạn sau 24 giờ. Nếu liên kết hết hạn, bạn sẽ cần yêu cầu một liên kết xác minh mới.</p>
            <p style="color: #555;">Nếu bạn không đăng ký tài khoản, vui lòng bỏ qua email này.</p>
            <p style="color: #555; font-size: 12px; margin-top: 20px;">Cảm ơn bạn!</p>
          </div>
        </body>
      </html>
    `,
  };
};

export const getResetPasswordEmail = (firstName: string, token: string): { subject: string; html: string } => {
  return {
    subject: 'Yêu cầu đặt lại mật khẩu',
    html: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; background-color: #f4f4f4; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);">
            <h2 style="color: #333;">Xin chào ${firstName},</h2>
            <p style="color: #555;">Bạn đã yêu cầu đặt lại mật khẩu. Để tạo mật khẩu mới, vui lòng nhấp vào liên kết dưới đây:</p>
            <p style="text-align: center;">
              <a href="${CLIENT_URL}/account/reset-password?token=${token}" style="background-color: #28a745; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px;">Đặt lại mật khẩu</a>
            </p>
            <p style="color: #555;">Liên kết này sẽ hết hạn trong 30 phút.</p>
            <p style="color: #555;">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
            <p style="color: #555; font-size: 12px; margin-top: 20px;">Cảm ơn bạn!</p>
          </div>
        </body>
      </html>
    `,
  };
};
