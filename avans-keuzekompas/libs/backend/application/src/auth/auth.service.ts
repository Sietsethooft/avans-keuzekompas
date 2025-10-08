import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '@avans-keuzekompas/infrastructure';
import { JwtHelper } from '@avans-keuzekompas/infrastructure';
import { AuthResult} from '@avans-keuzekompas/domain';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtHelper: JwtHelper,
  ) {}

  async loginWithEmailAndPassword(email: string, password: string): Promise<AuthResult> {
    const user = await this.authRepository.findByEmail(email);
    if (!user || !(await this.authRepository.comparePassword(password, user.password))) {
      throw new UnauthorizedException('Ongeldige inloggegevens');
    }
    const access_token = this.jwtHelper.generateToken(user);
    return { access_token };
  }
}