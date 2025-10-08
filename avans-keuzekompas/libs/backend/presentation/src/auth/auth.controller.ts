import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    Logger.log('Login attempt:', body.email);
    try {
      const result = await this.authService.loginWithEmailAndPassword(body.email, body.password);
      Logger.log('Login successful for:', result);
      return jsonResponse(200, 'Login succesvol', result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login mislukt';
      Logger.log('Login failed:', errorMessage);
      return jsonResponse(500, errorMessage, null);
    }
  }

  @Post('register')
  async register(
    @Body() body: { 
      firstName: string; 
      lastName: string; 
      email: string; 
      studentNumber: string; 
      password: string;
    }
  ) {
    Logger.log(`recieved body: ${JSON.stringify(body)}`, 'AuthController');
    try {
      const result = await this.authService.register(body);
      return jsonResponse(201, 'Registratie succesvol', result);
    } catch (err: unknown) {
      return jsonResponse(500, (err as Error).message || 'Registratie mislukt', null);
    }
  }

}