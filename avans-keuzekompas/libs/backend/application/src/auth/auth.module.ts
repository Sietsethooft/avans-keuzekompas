import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthRepository } from '@avans-keuzekompas/infrastructure';
import { JwtHelper } from '@avans-keuzekompas/infrastructure';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@avans-keuzekompas/infrastructure';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtHelper,
  ],
  exports: [AuthService],
})
export class AuthModule {}