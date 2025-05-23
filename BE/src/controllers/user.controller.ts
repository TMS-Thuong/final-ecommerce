import { FastifyReply, FastifyRequest } from 'fastify';

import UserService from '@app/services/user.service';
import { updateUserZodSchema, updatePasswordZodSchema } from '@app/validations/user.zod';
import { binding } from '@decorator/binding';

import { saveAvatarFile } from '../utils/file.util';

interface UpdatePasswordBody {
  currentPassword: string;
  newPassword: string;
}

class UserController {
  @binding
  async profile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.unauthorized('User not authenticated', 'UNAUTHORIZED');
      }

      const user = await UserService.getUserById(userId);
      if (!user) {
        return reply.notFound('User not found', 'USER_NOT_FOUND');
      }

      const { ...userData } = user;

      return reply.ok(userData);
    } catch (error) {
      console.error('Error in profile:', error);
      return reply.internalError('Failed to get user profile', 'GET_PROFILE_ERROR');
    }
  }

  @binding
  async editProfile(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.unauthorized('User not authenticated', 'UNAUTHORIZED');
      }

      const validation = updateUserZodSchema.partial().safeParse(request.body);
      if (!validation.success) {
        return reply.badRequest(validation.error.message, 'INVALID_USER_DATA');
      }

      const userData = validation.data;
      const updatedUser = await UserService.updateUser(userId, userData);

      const { ...safeUserData } = updatedUser;

      return reply.ok(safeUserData);
    } catch (error) {
      console.error('Error in editProfile:', error);
      return reply.internalError('Failed to update profile', 'UPDATE_PROFILE_ERROR');
    }
  }

  @binding
  async editPassword(request: FastifyRequest<{ Body: UpdatePasswordBody }>, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.unauthorized('User not authenticated', 'UNAUTHORIZED');
      }

      const validation = updatePasswordZodSchema.safeParse(request.body);
      if (!validation.success) {
        return reply.badRequest(validation.error.message, 'INVALID_PASSWORD_FORMAT');
      }

      const { currentPassword, newPassword } = validation.data;
      await UserService.updatePassword(userId, currentPassword, newPassword);

      return reply.ok({ message: 'Password updated successfully' });
    } catch (error) {
      console.error('Error in editPassword:', error);
      if (error instanceof Error) {
        return reply.badRequest(error.message, 'PASSWORD_UPDATE_ERROR');
      }
      return reply.internalError('Failed to update password', 'PASSWORD_UPDATE_ERROR');
    }
  }

  @binding
  async updateAvatar(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    try {
      const userId = request.user?.userId;
      if (!userId) {
        return reply.unauthorized('User not authenticated', 'UNAUTHORIZED');
      }

      const file = await request.file();

      if (!file) {
        return reply.badRequest('No file uploaded', 'NO_FILE_UPLOADED');
      }

      const { url } = await saveAvatarFile(file);
      const updatedUser = await UserService.updateAvatar(userId, url);

      const { ...safeUserData } = updatedUser;

      return reply.ok(safeUserData);
    } catch (error) {
      console.error('Error in updateAvatar:', error);
      return reply.internalError('Failed to update avatar', 'AVATAR_UPDATE_ERROR');
    }
  }
}

export default new UserController();
