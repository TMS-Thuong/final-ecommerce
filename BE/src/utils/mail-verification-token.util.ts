import crypto from 'crypto';

import dayjs from 'dayjs';
import jwt from 'jsonwebtoken';

import { EmailVerificationToken } from '@app/types/email.type';
import { JWT_SECRET } from '@config/index';

type TokenStrategy = 'jwt' | 'crypto';

export function generateEmailVerificationToken(
  email: string,
  strategy: TokenStrategy = 'crypto'
): EmailVerificationToken {
  const expiresAt = dayjs().add(24, 'hour').toDate();

  if (strategy === 'jwt') {
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    return { token, expiresAt };
  }

  const token = crypto.randomBytes(20).toString('hex');
  return { token, expiresAt };
}
