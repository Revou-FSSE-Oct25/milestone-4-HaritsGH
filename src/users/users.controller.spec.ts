import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  const mockProfile = {
    username: 'johndoe',
    fullname: 'John Doe',
    email: 'john.doe@example.com',
    favNum: 42,
  };

  const mockUpdatedProfile = {
    username: 'johndoe',
    fullname: 'John Smith',
    email: 'john.doe@example.com',
    favNum: 7,
  };

  const mockUsersService = {
    getProfileInfo: jest.fn().mockResolvedValue(mockProfile),
    update: jest.fn().mockResolvedValue(mockUpdatedProfile),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /users/profile', () => {
    it('should get profile info successfully', async () => {
      const mockRequest = { user: { username: 'johndoe' } };

      const result = await controller.getProfileInfo(mockRequest);

      expect(usersService.getProfileInfo).toHaveBeenCalledWith('johndoe');
      expect(result).toEqual(mockProfile);
    });

    it('should handle profile retrieval errors', async () => {
      const mockRequest = { user: { username: 'nonexistent' } };
      const error = new Error('User not found');
      mockUsersService.getProfileInfo.mockRejectedValueOnce(error);

      await expect(controller.getProfileInfo(mockRequest)).rejects.toThrow('User not found');
      expect(usersService.getProfileInfo).toHaveBeenCalledWith('nonexistent');
    });
  });

  describe('PATCH /users/profile', () => {
    it('should update profile successfully', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'John Smith',
        favnum: 7,
      };
      const mockRequest = { user: { username: 'johndoe' } };

      const result = await controller.update(updateUserDto, mockRequest);

      expect(usersService.update).toHaveBeenCalledWith(updateUserDto, 'johndoe');
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should update profile with only fullname', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'John Smith',
      };
      const mockRequest = { user: { username: 'johndoe' } };

      const result = await controller.update(updateUserDto, mockRequest);

      expect(usersService.update).toHaveBeenCalledWith(updateUserDto, 'johndoe');
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should update profile with only favnum', async () => {
      const updateUserDto: UpdateUserDto = {
        favnum: 7,
      };
      const mockRequest = { user: { username: 'johndoe' } };

      const result = await controller.update(updateUserDto, mockRequest);

      expect(usersService.update).toHaveBeenCalledWith(updateUserDto, 'johndoe');
      expect(result).toEqual(mockUpdatedProfile);
    });

    it('should handle profile update errors', async () => {
      const updateUserDto: UpdateUserDto = {
        fullname: 'John Smith',
      };
      const mockRequest = { user: { username: 'johndoe' } };
      const error = new Error('Update failed');
      mockUsersService.update.mockRejectedValueOnce(error);

      await expect(controller.update(updateUserDto, mockRequest)).rejects.toThrow('Update failed');
      expect(usersService.update).toHaveBeenCalledWith(updateUserDto, 'johndoe');
    });
  });
});
