import nodemailer from 'nodemailer';

import { EmailSentResultType } from '@app/types/email.type';
import { SMTP_SERVER, SMTP_USERNAME, SMTP_PASSWORD } from '@config/index';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_SERVER,
      port: 465,
      secure: true,
      auth: {
        user: SMTP_USERNAME,
        pass: SMTP_PASSWORD,
      },
    });
  }

  async sentResult(to: string, subject: string, html: string): Promise<EmailSentResultType> {
    try {
      const mailOptions = {
        from: `"Blog" <${SMTP_USERNAME}>`,
        to,
        subject,
        html,
      };

      await this.transporter.sendMail(mailOptions);

      return { success: true, message: 'Email đã được gửi thành công.' };
    } catch (error) {
      console.error('Gửi email thất bại:', error);
      return { success: false, message: 'Gửi email thất bại.' };
    }
  }
}

export default new EmailService();
