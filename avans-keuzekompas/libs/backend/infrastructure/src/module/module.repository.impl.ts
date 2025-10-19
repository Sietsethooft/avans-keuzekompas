import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Module } from './module.schema.js';

export class MongooseModuleRepository {
  constructor(
    @InjectModel(Module.name) private readonly moduleModel: Model<Module>
  ) {}

  async getAll(): Promise<Module[]> {
    return this.moduleModel.find().exec();
  }

  async getById(id: string): Promise<Module | null> {
    return this.moduleModel.findById(id).exec();
  }

  async deleteById(id: string): Promise<void> {
    await this.moduleModel.findByIdAndDelete(id).exec();
  }

  async findOne(criteria: Record<string, unknown>): Promise<Module | null> {
    return this.moduleModel.findOne(criteria).exec();
  }

  async updateById(id: string, updateData: Partial<Module>): Promise<Module | null> {
    return this.moduleModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}