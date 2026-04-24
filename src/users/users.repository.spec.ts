import { Test, TestingModule } from '@nestjs/testing';
import { UsersRepository } from './users.repository';
import { PrismaService } from '../prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersRepository', () => {
  let repository: UsersRepository;
  let prismaService: PrismaService;

  const mockProfile = {
    username: 'johndoe',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    favNum: 42,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockUpdatedProfile = {
    username: 'johndoe',
    fullname: 'John Smith',
    email: 'john.doe@example.com',
    favNum: 7,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    profile: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get<UsersRepository>(UsersRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getProfileInfo', () => {
    it('should query profile by username correctly', async () => {
      const username = 'johndoe';
      
      mockPrismaService.profile.findUnique.mockResolvedValue(mockProfile);

      const result = await repository.getProfileInfo(username);

      expect(prismaService.profile.findUnique).toHaveBeenCalledWith({
        where: {
          username: username,
        },
      });
      expect(result).toEqual(mockProfile);
    });

    it('should return null when profile not found by username', async () => {
      const username = 'nonexistent';
      
      mockPrismaService.profile.findUnique.mockResolvedValue(null);

      const result = await repository.getProfileInfo(username);

      expect(prismaService.profile.findUnique).toHaveBeenCalledWith({
        where: {
          username: username,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update existing profile with correct data structure', async () => {
      const username = 'johndoe';
      const updateUserDto: UpdateUserDto = {
        fullname: 'John Smith',
        favnum: 7,
      };
      
      mockPrismaService.profile.upsert.mockResolvedValue(mockUpdatedProfile);

      const result = await repository.update(updateUserDto, username);

      expect(prismaService.profile.upsert).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        create: {
          username: username,
          ...updateUserDto,
        },
        update: updateUserDto,
      });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should create new profile when profile does not exist', async () => {
      const username = 'newuser';
      const updateUserDto: UpdateUserDto = {
        fullname: 'New User',
        favnum: 10,
      };
      const newProfile = {
        username: 'newuser',
        fullname: 'New User',
        email: null,
        favNum: 10,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      mockPrismaService.profile.upsert.mockResolvedValue(newProfile);

      const result = await repository.update(updateUserDto, username);

      expect(prismaService.profile.upsert).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        create: {
          username: username,
          ...updateUserDto,
        },
        update: updateUserDto,
      });
      expect(result).toEqual(newProfile);
    });

    it('should update profile with only fullname', async () => {
      const username = 'johndoe';
      const updateUserDto: UpdateUserDto = {
        fullname: 'John Smith',
      };
      
      mockPrismaService.profile.upsert.mockResolvedValue(mockUpdatedProfile);

      const result = await repository.update(updateUserDto, username);

      expect(prismaService.profile.upsert).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        create: {
          username: username,
          ...updateUserDto,
        },
        update: updateUserDto,
      });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should update profile with only favnum', async () => {
      const username = 'johndoe';
      const updateUserDto: UpdateUserDto = {
        favnum: 7,
      };
      
      mockPrismaService.profile.upsert.mockResolvedValue(mockUpdatedProfile);

      const result = await repository.update(updateUserDto, username);

      expect(prismaService.profile.upsert).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        create: {
          username: username,
          ...updateUserDto,
        },
        update: updateUserDto,
      });
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should handle empty update DTO', async () => {
      const username = 'johndoe';
      const updateUserDto: UpdateUserDto = {};
      
      mockPrismaService.profile.upsert.mockResolvedValue(mockProfile);

      const result = await repository.update(updateUserDto, username);

      expect(prismaService.profile.upsert).toHaveBeenCalledWith({
        where: {
          username: username,
        },
        create: {
          username: username,
          ...updateUserDto,
        },
        update: updateUserDto,
      });
      expect(result).toEqual(mockProfile);
    });
  });
});
