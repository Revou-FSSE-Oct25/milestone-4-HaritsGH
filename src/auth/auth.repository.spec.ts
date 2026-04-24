import { Test, TestingModule } from "@nestjs/testing";
import { AuthRepository } from "./auth.repository";
import { PrismaService } from "../prisma.service";
import { RegisterDto } from "./dto/register.dto";

describe('AuthRepository', () => {
  let authRepository: AuthRepository;
  let prismaService: jest.Mocked<PrismaService>;

  beforeEach(async () => {
    const mockPrismaService = {
      user: {
        findFirst: jest.fn() as jest.Mock,
        findUnique: jest.fn() as jest.Mock,
        create: jest.fn() as jest.Mock,
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    authRepository = module.get<AuthRepository>(AuthRepository);
    prismaService = module.get(PrismaService) as any;
  });

  // Helper to avoid repetitive casting
  const mockUserMethods = () => ({
    findFirst: prismaService.user.findFirst as jest.Mock,
    findUnique: prismaService.user.findUnique as jest.Mock,
    create: prismaService.user.create as jest.Mock,
  });

  describe('checkUserExists', () => {
    it('should return "Email" when email exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(mockUser)
        .mockResolvedValueOnce(null);

      const result = await authRepository.checkUserExists('test@example.com', 'testuser');

      expect(result).toBe('Email');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
    });

    it('should return "Username" when username exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(mockUser);

      const result = await authRepository.checkUserExists('test@example.com', 'testuser');

      expect(result).toBe('Username');
      expect(prismaService.user.findFirst).toHaveBeenCalledWith({
        where: { username: 'testuser' }
      });
    });

    it('should return null when neither email nor username exists', async () => {
      (prismaService.user.findFirst as jest.Mock)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const result = await authRepository.checkUserExists('new@example.com', 'newuser');

      expect(result).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return user when username exists', async () => {
      const mockUser = { id: 1, email: 'test@example.com', username: 'testuser' };
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await authRepository.findOne('testuser');

      expect(result).toBe(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { username: 'testuser' }
      });
    });

    it('should return null when username is empty', async () => {
      const result = await authRepository.findOne('');

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    });

    it('should return null when username is null', async () => {
      const result = await authRepository.findOne(null as any);

      expect(result).toBeNull();
      expect(prismaService.user.findUnique).not.toHaveBeenCalled();
    });
  });

  describe('register', () => {
    it('should create user with profile successfully', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        userpw: 'password123',
        fullname: 'Test User',
        email: 'test@example.com',
        favNum: 42
      };

      const mockCreatedUser = {
        id: 1,
        username: 'testuser',
        userpw: 'password123',
        email: 'test@example.com',
        profile: {
          id: 1,
          fullname: 'Test User',
          favnum: 42,
          userId: 1
        }
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await authRepository.register(registerDto);

      expect(result).toBe(mockCreatedUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          userpw: 'password123',
          email: 'test@example.com',
          profile: {
            create: {
              fullname: 'Test User',
              favnum: 42
            }
          }
        }
      });
    });

    it('should create user with profile without favNum', async () => {
      const registerDto: RegisterDto = {
        username: 'testuser',
        userpw: 'password123',
        fullname: 'Test User',
        email: 'test@example.com'
      };

      const mockCreatedUser = {
        id: 1,
        username: 'testuser',
        userpw: 'password123',
        email: 'test@example.com',
        profile: {
          id: 1,
          fullname: 'Test User',
          favnum: null,
          userId: 1
        }
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockCreatedUser);

      const result = await authRepository.register(registerDto);

      expect(result).toBe(mockCreatedUser);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          username: 'testuser',
          userpw: 'password123',
          email: 'test@example.com',
          profile: {
            create: {
              fullname: 'Test User',
              favnum: undefined
            }
          }
        }
      });
    });
  });
});