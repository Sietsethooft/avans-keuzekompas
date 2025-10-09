import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { MongooseUserRepository } from '@avans-keuzekompas/infrastructure';
import { UserRepository } from '@avans-keuzekompas/domain';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@avans-keuzekompas/infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UserService,
    {
      provide: UserRepository,
      useClass: MongooseUserRepository,
    },
  ],
  exports: [UserService],
})
export class UserModule {}