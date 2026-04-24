import { Test, TestingModule } from '@nestjs/testing';
import { AccountsService } from './accounts.service';
import { AccountsRepository } from './accounts.repository';

describe('AccountsService', () => {
  let service: AccountsService;
  let accountsRepository: AccountsRepository;

  const mockAccount = {
    id: 1,
    accountNo: 'ABC12345',
    balance: 100.50,
    owner: 'johndoe',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAccountsRepository = {
    create: jest.fn().mockResolvedValue(mockAccount),
    findAll: jest.fn().mockResolvedValue([mockAccount]),
    findOne: jest.fn().mockResolvedValue(mockAccount),
    update: jest.fn().mockResolvedValue({ ...mockAccount, balance: 150.75 }),
    remove: jest.fn().mockResolvedValue(mockAccount),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AccountsService,
        {
          provide: AccountsRepository,
          useValue: mockAccountsRepository,
        },
      ],
    }).compile();

    service = module.get<AccountsService>(AccountsService);
    accountsRepository = module.get<AccountsRepository>(AccountsRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should generate a random 8-character alphanumeric geneid and pass it to repository', async () => {
      const owner = 'johndoe';
      
      await service.create(owner);

      expect(accountsRepository.create).toHaveBeenCalledWith(owner, expect.any(String));
      
      // Verify the geneid is exactly 8 characters long
      const geneid = (accountsRepository.create as jest.Mock).mock.calls[0][1];
      expect(geneid).toHaveLength(8);
      
      // Verify the geneid contains only lowercase letters and numbers
      expect(geneid).toMatch(/^[a-z0-9]{8}$/);
    });

    it('should generate different geneids for multiple calls', async () => {
      const owner = 'johndoe';
      
      // Reset mock to track multiple calls
      jest.clearAllMocks();
      
      await service.create(owner);
      await service.create(owner);
      
      const geneid1 = (accountsRepository.create as jest.Mock).mock.calls[0][1];
      const geneid2 = (accountsRepository.create as jest.Mock).mock.calls[1][1];
      
      // Both should be valid 8-character lowercase alphanumeric strings
      expect(geneid1).toHaveLength(8);
      expect(geneid2).toHaveLength(8);
      expect(geneid1).toMatch(/^[a-z0-9]{8}$/);
      expect(geneid2).toMatch(/^[a-z0-9]{8}$/);
      
      // They should be different (extremely unlikely to be the same)
      expect(geneid1).not.toBe(geneid2);
    });

    it('should pass the correct owner parameter along with geneid', async () => {
      const owner = 'testuser';
      
      // Clear previous mock calls
      jest.clearAllMocks();
      
      await service.create(owner);

      expect(accountsRepository.create).toHaveBeenCalledTimes(1);
      expect(accountsRepository.create).toHaveBeenCalledWith(owner, expect.any(String));
      
      const [passedOwner, geneid] = (accountsRepository.create as jest.Mock).mock.calls[0];
      expect(passedOwner).toBe(owner);
      expect(geneid).toHaveLength(8);
      expect(geneid).toMatch(/^[a-z0-9]{8}$/);
    });
  });
});
