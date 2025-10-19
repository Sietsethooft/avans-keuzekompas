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
    const access_token = this.jwtHelper.generateToken(user); // Generate JWT token
    return { access_token };
  }

  async register(body: {
    firstName: string;
    lastName: string;
    email: string;
    studentNumber: string;
    password: string;
  }): Promise<{ // Return minimal user info after registration
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    studentNumber: string;
    role: 'student' | 'admin';
  }> {
    // Check for existing email and student number
    const existingUser = await this.authRepository.findByEmail(body.email);
    if (existingUser) {
      throw new Error('E-mail bestaat al');
    }

    const existingStudent = await this.authRepository.findByStudentNumber(body.studentNumber);
    if (existingStudent) {
      throw new Error('Studentnummer bestaat al');
    }

    const hashedPassword = await bcrypt.hash(body.password, 10); // Hash password

    const newUser: User = await this.authRepository.createUser({ // Create new user
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      studentNumber: body.studentNumber,
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