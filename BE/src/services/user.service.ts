import { PrismaClient, User } from '@prisma/client';
import bcrypt from 'bcrypt';

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
      throw new Error('User not found');
    }

    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: userData.firstName,
          lastName: userData.lastName,
          birthDate: userData.birthDate,
          gender: userData.gender,
          phoneNumber: userData.phoneNumber,
          updatedAt: new Date(),
        },
      });

      return user;
    } catch (error) {
      console.error('Error updating user:', error);
      throw new Error('Failed to update user profile');
    }
  }

  async updatePassword(id: number, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await this.getUserById(id);

      if (!user.password) {
        throw new Error('User has no password set');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.prisma.user.update({
        where: { id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
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
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw new Error('Failed to update avatar');
    }
  }
}

export default new UserService();
