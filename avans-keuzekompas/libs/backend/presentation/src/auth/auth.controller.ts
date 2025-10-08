import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from '@avans-keuzekompas/application';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    Logger.log(`recieved body: ${JSON.stringify(body)}`, 'AuthController');
    Logger.log('Login attempt:', body.email);
    return this.authService.loginWithEmailAndPassword(body.email, body.password);
  }
}