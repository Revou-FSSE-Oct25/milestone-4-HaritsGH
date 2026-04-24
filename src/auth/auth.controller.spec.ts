import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockToken = {
    message: 'success',
    access_token: 'mock-token'
  };

  const mockAuthService = {
    register: jest.fn().mockResolvedValue(mockToken),
    login: jest.fn().mockResolvedValue(mockToken),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      const registerDto: RegisterDto = {
        username: 'johndoe',
        userpw: 'password123',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
        favNum: 42,
      };

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockToken);
    });

    it('should register a new user without optional fields', async () => {
      const registerDto: RegisterDto = {
        username: 'johndoe',
        userpw: 'password123',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
      };

      const result = await controller.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockToken);
    });

    it('should handle registration errors', async () => {
      const registerDto: RegisterDto = {
        username: 'johndoe',
        userpw: 'password123',
        fullname: 'John Doe',
        email: 'john.doe@example.com',
      };

      const error = new Error('Username already exists');
      mockAuthService.register.mockRejectedValueOnce(error);

      await expect(controller.register(registerDto)).rejects.toThrow('Username already exists');
      expect(authService.register).toHaveBeenCalledWith(registerDto);
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully and return token', async () => {
      const loginDto: LoginDto = {
        username: 'johndoe',
        userpw: 'password123',
      };

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockToken);
      expect(result.access_token).toBe('mock-token');
    });

    it('should handle login errors', async () => {
      const loginDto: LoginDto = {
        username: 'johndoe',
        userpw: 'wrongpassword',
      };

      const error = new Error('Invalid credentials');
      mockAuthService.login.mockRejectedValueOnce(error);

      await expect(controller.login(loginDto)).rejects.toThrow('Invalid credentials');
      expect(authService.login).toHaveBeenCalledWith(loginDto);
    });
  });
});
