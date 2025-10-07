import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from '@avans-keuzekompas/application';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    return this.authService.loginWithEmailAndPassword(body.email, body.password);
  }
}