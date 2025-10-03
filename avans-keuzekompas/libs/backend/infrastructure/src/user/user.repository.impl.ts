import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { UserRepository } from '@libs/backend/domain/user.repository';
import { User } from '@libs/backend/domain/user.entity';
import { UserDocument } from './user.schema.js';

export class MongooseUserRepository implements UserRepository {
  constructor(@InjectModel(UserDocument.name) private userModel: Model<UserDocument>) {}

  // andere methodes...
}