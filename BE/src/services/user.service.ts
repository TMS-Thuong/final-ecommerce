import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

import { USER_MESSAGES } from '@app/constants/message.constant';

class UserService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error(USER_MESSAGES.USER_NOT_FOUND);
    }

    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const updateData: Partial<User> = {
        updatedAt: new Date(),
      };

      if (userData.firstName !== undefined) updateData.firstName = userData.firstName;
      if (userData.lastName !== undefined) updateData.lastName = userData.lastName;
      if (userData.birthDate !== undefined) updateData.birthDate = userData.birthDate;
      if (userData.gender !== undefined) updateData.gender = userData.gender;
      if (userData.phoneNumber !== undefined) updateData.phoneNumber = userData.phoneNumber;

      const user = await this.prisma.user.update({
        where: { id },
        data: updateData,
      });

      return user;
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      throw new Error(USER_MESSAGES.UPDATE_PROFILE_ERROR);
    }
  }

  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserById(id);

      if (!user.password) {
        throw new Error(USER_MESSAGES.USER_NO_PASSWORD);
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error(USER_MESSAGES.CURRENT_PASSWORD_INCORRECT);
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } catch (error: unknown) {
      console.error('Error updating password:', error);
      throw error;
    }
  }

  async updateAvatar(id: number, avatarUrl: string): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          avatarUrl,
          updatedAt: new Date(),
        },
      });

      return user;
    } catch (error: unknown) {
      console.error('Error updating avatar:', error);
      throw new Error(USER_MESSAGES.UPDATE_AVATAR_ERROR);
    }
  }
}

export default new UserService();
