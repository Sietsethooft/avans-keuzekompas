import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Module as ModuleModel, ModuleSchema } from '@avans-keuzekompas/infrastructure';
import { User as UserModel, UserSchema } from '@avans-keuzekompas/infrastructure';
import { MongooseModuleRepository } from '@avans-keuzekompas/infrastructure';
import { MongooseUserRepository } from '@avans-keuzekompas/infrastructure';
import { SeedService } from '../seed.service';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/keuze-kompas'),
    MongooseModule.forFeature([
      { name: ModuleModel.name, schema: ModuleSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService, MongooseModuleRepository, MongooseUserRepository, SeedService],
})
export class AppModule {}