import { Controller, Post, Body, Logger } from '@nestjs/common';
import { AuthService } from '@avans-keuzekompas/application';
import { jsonResponse } from '@avans-keuzekompas/utils';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    Logger.log(`recieved body: ${JSON.stringify(body)}`, 'AuthController');
    Logger.log('Login attempt:', body.email);
    try {
      const result = await this.authService.loginWithEmailAndPassword(body.email, body.password);
      return jsonResponse(200, 'Login succesvol', result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Login mislukt';
      return jsonResponse(500, errorMessage, null);
    }
  }

  // @Post('register')
  // async register(@Body() body: { email: string; password: string; name: string }) {
  //   Logger.log(`recieved body: ${JSON.stringify(body)}`, 'AuthController');
  //   const emailError = validateEmail(body.email);
  //   const passwordError = validatePassword(body.password);
  //   if (emailError || passwordError) {
  //     return jsonResponse(400, emailError || passwordError, null);
  //   }
  //   try {
  //     const result = await this.authService.registerWithEmailAndPassword(body.email, body.password, body.name);
  //     return jsonResponse(201, 'Registratie succesvol', result);
  //   } catch (err: unknown) {
  //     return jsonResponse(500, err.message || 'Registratie mislukt', null);
  //   }
  // }
}