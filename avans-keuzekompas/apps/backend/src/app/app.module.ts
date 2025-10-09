import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { Module as ModuleModel, ModuleSchema } from '@avans-keuzekompas/infrastructure';
import { User as UserModel, UserSchema } from '@avans-keuzekompas/infrastructure';
import { MongooseModuleRepository, MongooseUserRepository } from '@avans-keuzekompas/infrastructure';
import { SeedService } from '../seed.service';
import { AuthModule } from '@avans-keuzekompas/application';
import { AuthController } from '@avans-keuzekompas/presentation';
import { UserModule } from '@avans-keuzekompas/application';
import { UserController } from '@avans-keuzekompas/presentation';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'apps/backend/.env'],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL || 'mongodb://localhost:27017/keuze-kompas'),
    MongooseModule.forFeature([
      { name: ModuleModel.name, schema: ModuleSchema },
      { name: UserModel.name, schema: UserSchema },
    ]),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController, AuthController, UserController],
  providers: [
    AppService,
    MongooseModuleRepository,
    MongooseUserRepository,
    SeedService,
  ],
})
export class AppModule {}