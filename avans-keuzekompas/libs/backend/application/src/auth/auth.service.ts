import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthRepository } from '@avans-keuzekompas/infrastructure';
import { JwtHelper } from '@avans-keuzekompas/infrastructure';
import { AuthResult} from '@avans-keuzekompas/domain';
import { User } from '@avans-keuzekompas/domain';
import * as bcrypt from 'bcrypt';

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

  async register(body: {
    firstName: string;
    lastName: string;
    email: string;
    studentNumber: string;
    password: string;
  }): Promise<{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentNumber: number;
    role: 'student' | 'admin';
  }> {
    const existingUser = await this.authRepository.findByEmail(body.email);
    if (existingUser) {
      throw new Error('E-mail bestaat al');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const newUser: User = await this.authRepository.createUser({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      studentNumber: Number(body.studentNumber),
      password: hashedPassword,
      role: 'student',
      favorites: [],
    });

    return {
      id: newUser.id,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      studentNumber: newUser.studentNumber,
      role: newUser.role,
    };
  }
}