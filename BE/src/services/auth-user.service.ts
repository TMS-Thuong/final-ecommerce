import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import jwt from 'jsonwebtoken';

import { AuthErrorMessages, AuthMessages } from '@app/config/auth.message';
import {
  ILoginData,
  UserData,
  IGoogleUser,
  SaveEmailVerificationTokenParams,
  GoogleAuthResponse,
  RefreshTokenResponse,
  VerifyTokenResponse,
} from '@app/types/auth.type';
import { IJwtTokenPair } from '@app/types/jwt.type';
import { GOOGLE_CLIENT_ID, JWT_SECRET } from '@config/index';
import { generateTokenPair, verifyRefreshToken } from '@utils/jwt-token.util';

const client = new OAuth2Client(GOOGLE_CLIENT_ID);

class AuthService {
  private prisma: PrismaClient;
  private jwtSecret: string;

  constructor() {
    this.prisma = new PrismaClient();
    this.jwtSecret = JWT_SECRET;

    if (!this.jwtSecret) {
      throw new Error(AuthErrorMessages.REQUIRED_JWT_SECRET);
    }
  }

  async checkEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async createUser(userData: UserData): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    return this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
        birthDate: userData.birthDate,
        gender: userData.gender,
        verificationToken: `${Date.now()}-${Math.random()}`,
        isActive: false,
      },
    });
  }

  async saveEmailVerificationToken({ userId, token, expiresAt }: SaveEmailVerificationTokenParams): Promise<void> {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: {
          verificationToken: token,
          verificationTokenExpires: expiresAt,
        },
      });
    } catch (error) {
      throw new Error(AuthErrorMessages.TOKEN_NOT_SAVED);
    }
  }

  async verifyToken(token: string): Promise<VerifyTokenResponse> {
    try {
      const user = await this.prisma.user.findFirst({
        where: { verificationToken: token },
      });

      if (!user) {
        return { success: false, message: AuthErrorMessages.TOKEN_INVALID };
      }

      if (dayjs().isAfter(dayjs(user.verificationTokenExpires))) {
        return { success: false, message: AuthErrorMessages.TOKEN_EXPIRED };
      }

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          isActive: true,
          verificationToken: null,
          verificationTokenExpires: null,
        },
      });

      return { success: true, message: AuthMessages.USER_ACTIVED };
    } catch (error) {
      return { success: false, message: AuthErrorMessages.TOKEN_INVALID };
    }
  }

  async verifyGoogleIdToken(tokenID: string): Promise<TokenPayload> {
    try {
      const ticket = client.verifyIdToken({
        idToken: tokenID,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = (await ticket).getPayload();
      if (!payload) throw new Error(AuthErrorMessages.PAYLOAD_INVALID);
      return payload;
    } catch (err) {
      throw new Error(AuthErrorMessages.TOKEN_INVALID);
    }
  }

  async authenticateWithGoogle(googleUser: IGoogleUser): Promise<GoogleAuthResponse> {
    const { email, name, picture, uid } = googleUser;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      if (!existingUser.avatarUrl && picture) {
        await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: uid,
            isActive: true,
            avatarUrl: picture,
          },
        });
      }

      const tokenPair: IJwtTokenPair = generateTokenPair({
        email: existingUser.email,
        userId: existingUser.id,
      });

      return {
        status: 'ok',
        accesstoken: tokenPair.accessToken,
        refreshToken: tokenPair.refreshToken,
      };
    }

    const [firstName = '', lastName = ''] = name?.split(' ') || [];
    const birthDate = googleUser.birthDate ? new Date(googleUser.birthDate) : new Date();
    if (isNaN(birthDate.getTime())) {
      throw new Error('BirthDate is not a valid date');
    }

    const newUser = await this.prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        googleId: uid,
        avatarUrl: picture || null,
        isActive: true,
        birthDate,
      },
    });

    const tokenPair: IJwtTokenPair = generateTokenPair({
      email: newUser.email,
      userId: newUser.id,
    });

    return {
      status: 'created',
      accesstoken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  async login({ email, password }: ILoginData): Promise<IJwtTokenPair> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) throw new Error(AuthErrorMessages.EMAIL_NOT_FOUND);
    if (!user.isActive) throw new Error(AuthErrorMessages.USER_NOT_ACTIVE);

    const isPasswordValid = await bcrypt.compare(password, user.password ?? '');
    if (!isPasswordValid) throw new Error(AuthErrorMessages.PASSWORD_INCORRECT);

    const payload = {
      email: user.email,
      userId: user.id,
    };

    return generateTokenPair(payload);
  }

  async refreshAccessToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const decoded = verifyRefreshToken(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || !user.isActive) {
        return { success: false, message: AuthErrorMessages.USER_NOT_ACTIVE, code: 'USER_NOT_ACTIVE' };
      }

      const newAccessToken = generateTokenPair({
        email: user.email,
        userId: user.id,
      });
      return {
        success: true,
        ...newAccessToken,
      };
    } catch (error) {
      return { success: false, message: AuthErrorMessages.TOKEN_INVALID, code: 'TOKEN_INVALID' };
    }
  }

  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      const { email } = jwt.verify(token, JWT_SECRET) as { email: string };

      const user = await this.prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        throw new Error(AuthErrorMessages.EMAIL_NOT_FOUND);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      });

      return true;
    } catch {
      throw new Error(AuthErrorMessages.TOKEN_INVALID);
    }
  }
}

export default new AuthService();
