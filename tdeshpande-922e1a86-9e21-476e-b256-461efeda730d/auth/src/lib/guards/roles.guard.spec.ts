import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { UserRole } from '@tdeshpande-922e1a86-9e21-476e-b256-461efeda730d/data';

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    guard = module.get<RolesGuard>(RolesGuard);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow access when no roles are required', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.VIEWER } }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue(undefined);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should allow Owner to access Admin-only endpoint', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.OWNER } }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should deny Viewer access to Admin-only endpoint', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.VIEWER } }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext)).toBe(false);
  });

  it('should allow Admin to access Admin-only endpoint', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: { role: UserRole.ADMIN } }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext)).toBe(true);
  });

  it('should deny access when user is not present', () => {
    const mockContext = {
      switchToHttp: () => ({
        getRequest: () => ({ user: null }),
      }),
      getHandler: () => ({}),
    } as ExecutionContext;

    jest.spyOn(reflector, 'get').mockReturnValue([UserRole.ADMIN]);

    expect(guard.canActivate(mockContext)).toBe(false);
  });
});
