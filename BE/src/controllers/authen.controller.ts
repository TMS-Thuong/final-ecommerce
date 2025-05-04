import { JWT_SECRET, logger } from '@config/index';
import { binding } from '@decorator/binding';
import { googleLoginSchema, registerUserZobSchema, verifyEmailZobSchema } from '@schemas/auth.zod';
import authService from '@services/auth.service';
import AuthService from '@services/auth.service';
import EmailService from '@services/email.service';
import { getVerificationEmail } from '@utils/email.utils';
import dayjs from 'dayjs';
import { FastifyReply, FastifyRequest } from 'fastify';
import jwt from 'jsonwebtoken';
import { ZodError } from 'zod';

class AuthController {
  @binding
  async registerUserByEmail(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = registerUserZobSchema.safeParse(request.body);

      if (!result.success) {
        const errors = result.error.errors;
        const emailOrPasswordError = errors.find((err) => err.path.includes('email') || err.path.includes('password'));

        if (emailOrPasswordError) {
          return reply.badRequest(emailOrPasswordError.message);
        }

        return reply.badRequest('Dữ liệu không hợp lệ');
      }

      const { email, password, firstName, lastName, birthDate, gender } = result.data;

      if (!email || !password) {
        return reply.badRequest('Email và mật khẩu là bắt buộc.');
      }

      const isEmailUsed = await AuthService.checkEmail(email);
      if (isEmailUsed) {
        return reply.badRequest('Email đã được sử dụng.');
      }

      const newUser = await AuthService.createUser({
        email,
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        birthDate: birthDate || null,
        gender: gender || 'OTHER',
      });

      const emailVerificationToken = jwt.sign({ email: newUser.email }, JWT_SECRET, { expiresIn: '24h' });

      const verificationTokenExpires = dayjs().add(24, 'hour').toDate();
      await AuthService.saveEmailVerificationToken(newUser.id, emailVerificationToken, verificationTokenExpires);

      const { subject, text } = getVerificationEmail(newUser.firstName, emailVerificationToken);
      const emailResult = await EmailService.sendEmail(newUser.email as string, subject, text);

      if (!emailResult.success) {
        return reply.internalError('Không thể gửi email xác thực.');
      }

      return reply.created({
        message: 'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          isActive: newUser.isActive,
        },
      });
    } catch (error: unknown) {
      logger.error('Lỗi register', error);
      if (error instanceof ZodError) {
        const messages = error.issues.map((i) => `- ${i.message}`).join('\n');
        return reply.badRequest(`Dữ liệu không hợp lệ:\n${messages}`);
      }

      return reply.internalError('Đã xảy ra lỗi không xác định.');
    }
  }

  @binding
  async verifyEmailController(request: FastifyRequest<{ Querystring: { token: string } }>, reply: FastifyReply) {
    try {
      const validationResult = verifyEmailZobSchema.safeParse({ token: request.query.token });

      if (!validationResult.success) {
        const errorMessage = validationResult.error.errors[0]?.message || 'Token không hợp lệ';
        return reply.badRequest(errorMessage);
      }

      const { token } = validationResult.data;
      const verifyResult = await AuthService.verifyEmailToken(token);

      if (verifyResult.success) return reply.ok({ message: verifyResult.message });
      return reply.badRequest(verifyResult.message);
    } catch (error) {
      logger.error('Lỗi verifying email:', error);
      return reply.internalError();
    }
  }

  @binding
  async googleSignInController(request: FastifyRequest, reply: FastifyReply) {
    try {
      const result = googleLoginSchema.safeParse(request.body);
      if (!result.success) {
        return reply.badRequest(result.error.errors[0]?.message || 'ID token không hợp lệ');
      }

      const { idToken } = result.data;

      const payload = await authService.verifyGoogleIdToken(idToken);

      if (!payload.email_verified) {
        return reply.badRequest('Email Google chưa được xác minh.');
      }

      if (!payload.email || !payload.name || !payload.sub) {
        return reply.badRequest('Thông tin người dùng không đầy đủ.');
      }

      const authResult = await authService.handleGoogleAuth({
        email: payload.email,
        name: payload.name,
        picture: payload.picture || '',
        uid: payload.sub,
      });

      return reply.status(200).send({
        message: authResult.message,
        accessToken: authResult.token,
        user: {
          data: authResult.user,
        },
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.stack : error;
      logger.error('Lỗi đăng nhập bằng Google, stack:', errorMessage);
      return reply.internalError('Lỗi đăng nhập Google');
    }
  }
}

export default new AuthController();
