import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthRepository } from '@avans-keuzekompas/infrastructure';
import { JwtHelper } from '@avans-keuzekompas/infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@avans-keuzekompas/infrastructure';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: { expiresIn: '1h' },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtHelper,
  ],
  exports: [AuthService],
})
export class AuthModule {}