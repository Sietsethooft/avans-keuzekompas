import { Injectable } from '@nestjs/common';
import { UserRepository } from '@avans-keuzekompas/domain';
import { User } from '@avans-keuzekompas/domain';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async deleteUserById(id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}