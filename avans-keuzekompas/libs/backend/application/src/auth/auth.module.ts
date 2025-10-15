import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthRepository } from '@avans-keuzekompas/infrastructure';
import { JwtHelper } from '@avans-keuzekompas/infrastructure';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@avans-keuzekompas/infrastructure';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '@avans-keuzekompas/infrastructure';

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET') ?? 'dev-secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  providers: [
    AuthService,
    AuthRepository,
    JwtHelper,
    JwtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule {}