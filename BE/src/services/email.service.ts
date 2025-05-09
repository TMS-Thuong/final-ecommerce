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

      return { success: true, message: 'Email has been successfully sent.' };
    } catch (error) {
      console.error('Email failure:', error);
      return { success: false, message: 'Email failed.' };
    }
  }
}

export default new EmailService();
