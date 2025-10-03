import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ModuleRepository } from '@libs/backend/domain/module.repository';
import { Module } from '@libs/backend/domain/module.entity';
import { ModuleDocument } from './module.schema.js';

export class MongooseModuleRepository implements ModuleRepository {
  constructor(@InjectModel(ModuleDocument.name) private moduleModel: Model<ModuleDocument>) {}

  // andere methodes...
}