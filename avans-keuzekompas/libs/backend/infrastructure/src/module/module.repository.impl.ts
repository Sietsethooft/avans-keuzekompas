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
}