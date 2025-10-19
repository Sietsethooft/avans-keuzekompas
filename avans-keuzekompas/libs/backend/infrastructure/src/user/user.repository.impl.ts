import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema.js';

export class MongooseUserRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async updateById(id: string, update: Partial<User>): Promise<User | null> {
    return this.userModel.findByIdAndUpdate(id, update, { new: true }).exec();
  }

  async findByStudentNumber(studentNumber: string): Promise<User | null> {
    return this.userModel.findOne({ studentNumber }).exec();
  }

  async removeFavoriteFromAllUsers(moduleId: string): Promise<void> {
    const id = new Types.ObjectId(moduleId);
    await this.userModel.updateMany(
      { favorites: id },
      { $pull: { favorites: id } } // Pull the moduleId from the favorites array
    ).exec();
  }
}