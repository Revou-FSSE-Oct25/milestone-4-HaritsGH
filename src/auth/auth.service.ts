import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthRepository } from './auth.repository';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const result = await this.authRepository.checkUserExists(registerDto.email, registerDto.username);
    if (result) {
      throw new ConflictException(`${result} has already been used.`);
    }

    const hashedPassword = await bcrypt.hash(registerDto.userpw, 10);

    await this.authRepository.register({
      ...registerDto,
      userpw: hashedPassword
    });

    const payload = {
      username: registerDto.username
    };
    
    return {
      message: 'Registration successful',
      access_token: this.jwtService.sign(payload)
    };
  }

  async login(loginDto: LoginDto) {
    const user = await this.authRepository.findOne(loginDto.username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.userpw, user.userpw);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      username: user.username
    };

    return {
      message: 'Login successful',
      access_token: this.jwtService.sign(payload)
    };
  }
}

