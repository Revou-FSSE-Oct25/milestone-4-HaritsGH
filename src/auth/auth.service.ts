import { Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import { AuthResponse } from 'src/types/auth.type';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async register(registerDto: RegisterDto) {
    const result = await this.authRepository.checkUser(registerDto.email, registerDto.username);
    if (result) {
      throw new Error(result as string);
    }
    return this.authRepository.register(registerDto);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    // TODO: Implement login logic
    return {
      message: 'Login successful',
      token: 'jwt-token-placeholder'
    };
  }
}

