import { UnauthorizedException } from '@nestjs/common';
import { comparePassword } from 'src/utils/password.encoder';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from 'src/email/email.service';
import { RedisConfigService } from 'src/redisconfig/redisconfig.service';
import { UsersEntity } from 'src/users/users.entity';



jest.mock('src/utils/password.encoder');

describe('AuthService - validateUser', () => {
  let authService: AuthService;
  let userService: jest.Mocked<UsersService>;

  const mockUser = {
  id: '1',
  email: 'test@example.com',
  password: 'hashed_password',
  roles: [{ roleName: 'admin' }, { roleName: 'user' }],
  provider: 'local',
  providerId: null,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
} as unknown as UsersEntity;

  const mockLoginDto: LoginDto = {
    email: 'test@example.com',
    password: 'plain_password',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
      AuthService,
      { provide: JwtService, useValue: { sign: jest.fn(), verify: jest.fn() } },
      { provide: ConfigService, useValue: { get: jest.fn() } },
      { provide: UsersService, useValue: { findByEmail: jest.fn() } },
      { provide: RedisConfigService, useValue: { set: jest.fn(), get: jest.fn() } },
      { provide: EmailService, useValue: { sendEmail: jest.fn() } },
    ],
  }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get(UsersService);

    // Mock private functions
    jest.spyOn(authService as any, 'generateToken').mockResolvedValue({ access_token: 'mock_access_token' });
    jest.spyOn(authService as any, 'generateRefreshToken').mockResolvedValue({ refresh_token: 'mock_refresh_token' });
    jest.spyOn(authService as any, 'setRefreshToken').mockResolvedValue(undefined);
  });

  afterEach(() => jest.clearAllMocks());

  // ✅ Happy path
  it('should return user data + token if credentials are valid',async () => {
    userService.findByEmail.mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);

    const result = await authService.validateUser(mockLoginDto);

    expect(result).toEqual({
      id: '1',
      email: 'test@example.com',
      roles: ['admin', 'user'],
      access_token: 'mock_access_token',
      refresh_token: 'mock_refresh_token',
    });
  });



  // ❌ Invalid Password
  it('should throw UnauthorizedException if password is invalid', async () => {
    userService.findByEmail.mockImplementation(() => { throw new UnauthorizedException('Invalid email or password');});
    (comparePassword as jest.Mock).mockResolvedValue(false);

    await expect(authService.validateUser(mockLoginDto)).rejects.toThrow(UnauthorizedException);
  });



  // ❌ Email not found
  it('should throw UnauthorizedException if user is not found', async () => {
    userService.findByEmail.mockImplementation(() => { throw new UnauthorizedException('Invalid email or password'); });
    (comparePassword as jest.Mock).mockResolvedValue(false);

    await expect(authService.validateUser(mockLoginDto)).rejects.toThrow(UnauthorizedException);
  });



  // ✅ Make sure generateToken, generateRefreshToken, setRefreshToken called in the right way
  it('should call generateToken and generateRefreshToken with correct user data', async () => {
    userService.findByEmail.mockResolvedValue(mockUser);
    (comparePassword as jest.Mock).mockResolvedValue(true);

    await authService.validateUser(mockLoginDto);

    expect(authService['generateToken']).toHaveBeenCalledWith('1', 'test@example.com', ['admin', 'user']);
    expect(authService['generateRefreshToken']).toHaveBeenCalledWith('1', 'test@example.com', ['admin', 'user']);
    expect(authService['setRefreshToken']).toHaveBeenCalledWith('1', 'mock_refresh_token');
  });


});