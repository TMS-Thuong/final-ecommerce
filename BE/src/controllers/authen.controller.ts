import { FastifyReply, FastifyRequest } from 'fastify';

import { AuthErrorMessages, AuthMessages } from '@app/config/auth.message';
import {
  forgotPasswordZodSchema,
  loginViaGoogleZobSchema,
  loginZodSchema,
  refreshTokenZodSchema,
  registerUserZobSchema,
  resendVerifyEmailZobSchema,
  resetPasswordZodSchema,
  verifyEmailZobSchema,
} from '@app/schemas/auth-user.zod';
import AuthService from '@app/services/auth-user.service';
import { createResetPasswordToken } from '@app/utils/jwt-token.util';
import { generateEmailVerificationToken } from '@app/utils/mail-verification-token.util';
import { getResetPasswordEmail, getVerificationEmail } from '@app/utils/text-email.util';
import { binding } from '@decorator/binding';
import EmailService from '@services/email.service';

class AuthController {
  @binding
  async registerUserByEmail(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = registerUserZobSchema.safeParse(request.body);

      if (!result.success) {
        const emailOrPasswordError = result.error.errors.find(
          (err) => err.path.includes('email') || err.path.includes('password')
        );

        return reply.badRequest(emailOrPasswordError?.message || AuthErrorMessages.INVALID_DATA, 'INVALID_DATA');
      }

      const { email, password, firstName, lastName, birthDate, gender } = result.data;

      const isEmailExists = await AuthService.checkEmail(email);
      if (isEmailExists) {
        return reply.conflict(AuthErrorMessages.EMAIL_USED, 'EMAIL_USED');
      }

      const newUser = await AuthService.createUser({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        birthDate: birthDate || null,
        gender,
      });

      const { token: emailVerificationToken, expiresAt: verificationTokenExpires } = generateEmailVerificationToken(
        newUser.email,
        'crypto'
      );
      await AuthService.saveEmailVerificationToken({
        userId: newUser.id,
        token: emailVerificationToken,
        expiresAt: verificationTokenExpires,
      });

      const { subject, html } = getVerificationEmail(newUser.firstName, emailVerificationToken);
      const emailResult = await EmailService.sentResult(newUser.email, subject, html);

      if (!emailResult.success) {
        return reply.internalError(AuthErrorMessages.VERIFICATION_EMAIL_FAILED);
      }

      return reply.created({
        message: AuthMessages.REGISTRATION_SUCCESS,
      });
    } catch (error: unknown) {
      return reply.internalError();
    }
  }

  @binding
  async resendVerificationEmail(
    request: FastifyRequest<{ Querystring: { email: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    try {
      const { email } = resendVerifyEmailZobSchema.parse(request.query);

      const user = await AuthService.checkEmail(email);
      if (!user) {
        return reply.badRequest(AuthErrorMessages.USER_NOT_FOUND, 'USER_NOT_FOUND');
      }

      if (user.isActive) {
        return reply.badRequest(AuthErrorMessages.ALREADY_VERIFIED, 'ALREADY_VERIFIED');
      }

      const { token: emailVerificationToken, expiresAt: verificationTokenExpires } = generateEmailVerificationToken(
        user.email,
        'crypto'
      );

      await AuthService.saveEmailVerificationToken({
        userId: user.id,
        token: emailVerificationToken,
        expiresAt: verificationTokenExpires,
      });

      const { subject, html } = getVerificationEmail(user.firstName, emailVerificationToken);
      const emailResult = await EmailService.sentResult(user.email, subject, html);

      if (!emailResult.success) {
        return reply.internalError(AuthErrorMessages.VERIFICATION_EMAIL_FAILED);
      }

      return reply.ok({
        message: AuthMessages.VERIFICATION_EMAIL_SENT,
      });
    } catch (error: unknown) {
      return reply.internalError();
    }
  }

  @binding
  async verifyEmail(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply): Promise<void> {
    try {
      const validationResult = verifyEmailZobSchema.safeParse({ token: request.query.token });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || AuthErrorMessages.TOKEN_INVALID;
        return reply.badRequest(errorMessage, 'TOKEN_INVALID');
      }

      const { token } = validationResult.data;
      const verifyResult = await AuthService.verifyToken(token);

      if (!verifyResult.success) {
        if (verifyResult.message === AuthErrorMessages.TOKEN_INVALID) {
          return reply.badRequest(verifyResult.message, 'TOKEN_INVALID');
        }

        if (verifyResult.message === AuthErrorMessages.TOKEN_EXPIRED) {
          return reply.badRequest(verifyResult.message, 'TOKEN_EXPIRED');
        }

        return reply.badRequest(AuthErrorMessages.INVALID_DATA, 'INVALID_DATA');
      }
      return reply.ok({ message: verifyResult.message });
    } catch (error) {
      return reply.internalError();
    }
  }

  @binding
  async loginViaGoogle(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const result = loginViaGoogleZobSchema.safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(AuthErrorMessages.TOKENID_INVALID, 'TOKENID_INVALID');
      }

      const { idToken } = result.data;
      const payload = await AuthService.verifyGoogleIdToken(idToken);
      if (!payload.name || !payload.sub) {
        return reply.badRequest(AuthErrorMessages.USER_INFO_INCOMPLETE, 'USER_INFO_INCOMPLETE');
      }

      const authResult = await AuthService.authenticateWithGoogle({
        email: payload.email,
        name: payload.name,
        picture: payload.picture || '',
        uid: payload.sub,
        birthDate: undefined,
      });

      if (authResult.status === 'ok') {
        return reply.ok({
          message: AuthMessages.LOGIN_SUCCESS,
          accessToken: authResult.accesstoken,
          refreshToken: authResult.refreshToken,
        });
      }

      if (authResult.status === 'created') {
        return reply.created({
          message: AuthMessages.REGISTER_GOOGLE_SUCCESS,
          accessToken: authResult.accesstoken,
          refreshToken: authResult.refreshToken,
        });
      }
    } catch (error) {
      return reply.internalError();
    }
  }

  @binding
  async loginUserWithEmail(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const validationResult = loginZodSchema.safeParse(request.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || AuthErrorMessages.INVALID_DATA;
        return reply.badRequest(errorMessage, 'INVALID_DATA');
      }

      const { email, password } = validationResult.data;
      const { accessToken, refreshToken } = await AuthService.login({ email, password });

      return reply.ok({
        accessToken,
        refreshToken,
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === AuthErrorMessages.EMAIL_NOT_FOUND) {
          return reply.notFound(error.message, 'EMAIL_NOT_FOUND');
        }
        if (error.message === AuthErrorMessages.USER_NOT_ACTIVE) {
          return reply.badRequest(error.message, 'USER_NOT_ACTIVE');
        }
        if (error.message === AuthErrorMessages.PASSWORD_INCORRECT) {
          return reply.badRequest(error.message, 'PASSWORD_INCORRECT');
        }
      }
      return reply.internalError();
    }
  }

  @binding
  async refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const validationResult = refreshTokenZodSchema.safeParse(request.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || AuthErrorMessages.REFRESH_TOKEN_INVALID;
        return reply.badRequest(errorMessage, 'REFRESH_TOKEN_INVALID');
      }

      const { refreshToken } = validationResult.data;
      const refreshResult = await AuthService.refreshAccessToken(refreshToken);

      if (!refreshResult.success) {
        const errorCode = refreshResult.code || 'UNAUTHORIZED';
        return reply.unauthorized(refreshResult.message || AuthErrorMessages.UNAUTHORIZED, errorCode);
      }
      return reply.ok({ accessToken: refreshResult.accessToken });
    } catch (error) {
      return reply.internalError();
    }
  }

  @binding
  async forgotPassword(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const validationResult = forgotPasswordZodSchema.safeParse(request.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || AuthErrorMessages.EMAIL_INVALID;
        return reply.badRequest(errorMessage, 'EMAIL_INVALID');
      }

      const { email } = validationResult.data;

      const user = await AuthService.checkEmail(email);

      if (!user) {
        return reply.badRequest(AuthErrorMessages.USER_NOT_FOUND, 'USER_NOT_FOUND');
      }

      if (!user.isActive) {
        return reply.badRequest(AuthErrorMessages.USER_NOT_ACTIVE, 'USER_NOT_ACTIVE');
      }

      if (user.googleId && user.password === null) {
        return reply.badRequest(AuthErrorMessages.GOOGLE_ACCOUNT_CANNOT_RESET, 'GOOGLE_ACCOUNT_CANNOT_RESET');
      }

      const resetToken = await createResetPasswordToken(email);
      const emailContent = getResetPasswordEmail(user.firstName ?? '', resetToken);
      const emailResult = await EmailService.sentResult(email, emailContent.subject, emailContent.html);

      if (!emailResult.success) {
        return reply.internalError(AuthErrorMessages.FAILED_TO_SEND_EMAIL);
      }

      return reply.ok({ message: AuthMessages.RESET_EMAIL_SENT });
    } catch (error) {
      console.error('Error in forgotPassword:', error);
      return reply.internalError(AuthErrorMessages.SERVER_ERROR, 'SERVER_ERROR');
    }
  }

  @binding
  async resetPassword(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const validationResult = resetPasswordZodSchema.safeParse(request.body);

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || AuthErrorMessages.INVALID_DATA;
        return reply.badRequest(errorMessage, 'INVALID_DATA');
      }

      const { token, newPassword } = validationResult.data;
      await AuthService.resetPassword(token, newPassword);

      return reply.ok({ message: AuthMessages.PASSWORD_UPDATED });
    } catch (error) {
      if (error instanceof Error) {
        return reply.badRequest(AuthErrorMessages.TOKEN_EXPIRED, 'TOKEN_EXPIRED');
      } else {
        reply.internalError();
      }
    }
  }
}

export default new AuthController();
