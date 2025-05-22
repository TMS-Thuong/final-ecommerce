import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
export const HOST = process.env.HOST || '';
export const BASE_URL = process.env.BASE_URL || '';
export const CLIENT_URL = process.env.CLIENT_URL || '';
export const ORDER_COMPLETE = process.env.ORDER_COMPLETE || '';
export const JWT_SECRET = process.env.JWT_SECRET || '';
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const SMTP_SERVER = process.env.SMTP_SERVER || 'smtp.gmail.com';
export const SMTP_USERNAME = process.env.GMAIL_USERNAME || '';
export const SMTP_PASSWORD = process.env.GMAIL_PASSWORD || '';
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
export const VNP_TMN_CODE = process.env.VNP_TMN_CODE || '';
export const VNP_HASH_SECRET = process.env.VNP_HASH_SECRET || '';
export const VNP_URL = process.env.VNP_URL || '';
export const VNP_RETURN_URL = process.env.VNP_RETURN_URL || `${BASE_URL}/payment/vnpay_return`;
