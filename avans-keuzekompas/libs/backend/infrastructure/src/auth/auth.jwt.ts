import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@avans-keuzekompas/domain';

@Injectable()
export class JwtHelper {
  constructor(private jwtService: JwtService) {}

  generateToken(user: User): string {
    const payload = { sub: user.id, role: user.role };
    return this.jwtService.sign(payload);
  }
}