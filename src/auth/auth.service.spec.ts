import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepository } from './auth.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let repository: jest.Mocked<AuthRepository>;
  let jwt: jest.Mocked<JwtService>;

  const mockUser = {
    id: 1,
    username: 'testuser',
    userpw: 'hashedpassword',
    email: 'test@example.com',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRegisterDto: RegisterDto = {
    username: 'testuser',
    userpw: 'password123',
    fullname: 'Test User',
    email: 'test@example.com',
    favNum: 42,
  };

  const mockLoginDto: LoginDto = {
    username: 'testuser',
    userpw: 'password123',
  };

  const mockRegisterJwtResponse = {
    message: 'Registration successful',
    access_token: 'jwt-token',
  };

  const mockLoginJwtResponse = {
    message: 'Login successful',
    access_token: 'jwt-token',
  };

  const mockAuthRepository = {
    checkUserExists: jest.fn(),
    register: jest.fn(),
    findOne: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('jwt-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: AuthRepository,
          useValue: mockAuthRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    repository = module.get(AuthRepository);
    jwt = module.get(JwtService);
    
    // Reset all mocks before each test
    repository.checkUserExists.mockReset();
    repository.register.mockReset();
    repository.findOne.mockReset();
    jwt.sign.mockReset();
    (bcrypt.hash as jest.Mock).mockReset();
    (bcrypt.compare as jest.Mock).mockReset();
  });


  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register successfully when email and username are unique', async () => {
      repository.checkUserExists.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedpassword');
      repository.register.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue('jwt-token');

      const result = await service.register(mockRegisterDto);

      expect(repository.checkUserExists).toHaveBeenCalledWith(mockRegisterDto.email, mockRegisterDto.username);
      expect(bcrypt.hash).toHaveBeenCalledWith(mockRegisterDto.userpw, 10);
      expect(repository.register).toHaveBeenCalledWith({
        ...mockRegisterDto,
        userpw: 'hashedpassword',
      });
      expect(jwt.sign).toHaveBeenCalledWith({ username: mockRegisterDto.username });
      expect(result).toEqual(mockRegisterJwtResponse);
    });

    it('should throw ConflictException when email is already used', async () => {
      repository.checkUserExists.mockResolvedValue('Email');

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        new ConflictException('Email has already been used.')
      );

      expect(repository.checkUserExists).toHaveBeenCalledWith(mockRegisterDto.email, mockRegisterDto.username);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repository.register).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when username is already used', async () => {
      repository.checkUserExists.mockResolvedValue('Username');

      await expect(service.register(mockRegisterDto)).rejects.toThrow(
        new ConflictException('Username has already been used.')
      );

      expect(repository.checkUserExists).toHaveBeenCalledWith(mockRegisterDto.email, mockRegisterDto.username);
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(repository.register).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      jwt.sign.mockReturnValue('jwt-token');

      const result = await service.login(mockLoginDto);

      expect(repository.findOne).toHaveBeenCalledWith(mockLoginDto.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.userpw, mockUser.userpw);
      expect(jwt.sign).toHaveBeenCalledWith({ username: mockUser.username });
      expect(result).toEqual(mockLoginJwtResponse);
    });

    it('should throw UnauthorizedException when user is not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );

      expect(repository.findOne).toHaveBeenCalledWith(mockLoginDto.username);
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(mockLoginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid credentials')
      );

      expect(repository.findOne).toHaveBeenCalledWith(mockLoginDto.username);
      expect(bcrypt.compare).toHaveBeenCalledWith(mockLoginDto.userpw, mockUser.userpw);
      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });
});
