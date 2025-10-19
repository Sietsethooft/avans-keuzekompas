import { User } from './user.entity.js';

export abstract class UserRepository {
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract deleteById(id: string): Promise<void>;
  abstract updateById(id: string, updateData: Partial<User>): Promise<User | null>;
  abstract findByStudentNumber(studentNumber: string): Promise<User | null>;
  abstract removeFavoriteFromAllUsers(moduleId: string): Promise<void>;
}