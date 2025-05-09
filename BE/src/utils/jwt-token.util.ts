import jwt from 'jsonwebtoken';

import { IJwtPayload } from '@app/types/jwt.type';
import { JWT_SECRET } from '@config/index';

// Hàm giải mã refresh token
export const verifyRefreshToken = (token: string): IJwtPayload & { userId: number } => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload & { userId: number };
    return decoded;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export const generateTokenPair = (payload: object): { accessToken: string; refreshToken: string } => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '2h' });
  const refreshToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });

  return { accessToken, refreshToken };
};
export const createResetPasswordToken = async (email: string): Promise<string> => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: '30m' });
};

export const verifyToken = (token: string): IJwtPayload => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as IJwtPayload;
    return decoded;
  } catch (error) {
    throw new Error('The token is not valid or has expired');
  }
};
