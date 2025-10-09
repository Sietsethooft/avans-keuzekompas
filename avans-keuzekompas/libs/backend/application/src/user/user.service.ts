import { Injectable } from '@nestjs/common';
import { UserRepository } from '@avans-keuzekompas/domain';
import { User } from '@avans-keuzekompas/domain';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }

  async updateUserById(
    id: string,
    update: Partial<{ firstName: string; lastName: string; email: string; studentNumber: string; favorites: string[]; password: string }>
  ): Promise<User | null> {
    if (update.email) {
      const existing = await this.userRepository.findByEmail(update.email);
      if (existing && existing.id !== id) {
        throw new Error('Email already in use');
      }
    }
    if (update.password) {
      const saltRounds = 10;
      update.password = await bcrypt.hash(update.password, saltRounds);
    }
    return this.userRepository.updateById(id, update);
  }
}