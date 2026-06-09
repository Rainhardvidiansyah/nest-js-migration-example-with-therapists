import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';

import { UserRegistrationProducer } from 'src/queue/producers/user-registration.producer';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UsersService;
  let registrationQueue: UserRegistrationProducer;

  // Satu mock per dependency, tidak ada duplicate
  const mockJwtService = { sign: jest.fn(), verify: jest.fn() };
  const mockConfigService = { get: jest.fn() };
  const mockUsersService = { getUserByEmail: jest.fn() };
  const mockRedisConfigService = { getClient: jest.fn() };
  const mockUserRegistrationProducer = { addUserRegistrationJob: jest.fn() };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService,               useValue: mockJwtService },
        { provide: ConfigService,            useValue: mockConfigService },
        { provide: UsersService,             useValue: mockUsersService },
        { provide: RedisConfigService,       useValue: mockRedisConfigService },
        { provide: UserRegistrationProducer, useValue: mockUserRegistrationProducer },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UsersService>(UsersService);
    registrationQueue = module.get<UserRegistrationProducer>(UserRegistrationProducer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // ─────────────────────────────────────────────
  describe('createLocalUser', () => {

    // ✅ CASE 1: Email belum ada → job masuk queue
    it('should add job to queue when email does not exist', async () => {
      const dto = { email: 'budi@email.com', password: 'rahasia123' };
      mockUsersService.getUserByEmail.mockResolvedValue(null);

      await authService.createLocalUser({...dto, confirmPassword:dto.password});

      expect(userService.getUserByEmail).toHaveBeenCalledWith(dto.email);
      expect(registrationQueue.addUserRegistrationJob).toHaveBeenCalledWith({
        email: dto.email,
        password: dto.password,
      });
    });

    // ❌ CASE 2: Email sudah ada →던지지 ConflictException
    it('should throw ConflictException when email already exists', async () => {
      const dto = { email: 'existing@email.com', password: 'rahasia123' };
      mockUsersService.getUserByEmail.mockResolvedValue({ id: 1, email: dto.email });

      await expect(authService.createLocalUser({...dto, confirmPassword:dto.password})).rejects.toThrow(
        ConflictException,
      );
      await expect(authService.createLocalUser({...dto, confirmPassword:dto.password})).rejects.toThrow(
        'Email already exists',
      );
    });

    // 🚫 CASE 3: Email sudah ada → queue TIDAK boleh dipanggil
    it('should NOT call addUserRegistrationJob when email already exists', async () => {
      const dto = { email: 'existing@email.com', password: 'rahasia123' };
      mockUsersService.getUserByEmail.mockResolvedValue({ id: 1, email: dto.email });

      await authService.createLocalUser({...dto, confirmPassword:dto.password}).catch(() => {});

      expect(registrationQueue.addUserRegistrationJob).not.toHaveBeenCalled();
    });

  });
  // ─────────────────────────────────────────────

});