import type { Request, Response } from 'express';

jest.mock('../../../src/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  },
}));

jest.mock('../../../src/utils/auth', () => ({
  getSessionCookieName: jest.fn(),
  getSessionCookieOptions: jest.fn(),
  hashPassword: jest.fn(),
  isBcryptHash: jest.fn(),
  signSessionToken: jest.fn(),
  verifyPassword: jest.fn(),
}));

import { login, logout, me } from '../../../src/controllers/auth.controller';
import { prisma } from '../../../src/lib/prisma';
import {
  getSessionCookieName,
  getSessionCookieOptions,
  hashPassword,
  isBcryptHash,
  signSessionToken,
  verifyPassword,
} from '../../../src/utils/auth';

describe('auth controller', () => {
  const mockedPrisma = prisma as any;

  const mockedGetSessionCookieName = getSessionCookieName as jest.Mock;
  const mockedGetSessionCookieOptions = getSessionCookieOptions as jest.Mock;
  const mockedHashPassword = hashPassword as jest.Mock;
  const mockedIsBcryptHash = isBcryptHash as jest.Mock;
  const mockedSignSessionToken = signSessionToken as jest.Mock;
  const mockedVerifyPassword = verifyPassword as jest.Mock;

  function createResponse(): Response {
    return {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn().mockReturnThis(),
      clearCookie: jest.fn().mockReturnThis(),
    } as unknown as Response;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);

    mockedGetSessionCookieName.mockReturnValue('arrowhead_session');
    mockedGetSessionCookieOptions.mockReturnValue({
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 604800000,
    });
    mockedSignSessionToken.mockReturnValue('signed-token');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns 400 when login credentials are missing', async () => {
    const req = { body: { username: 'staff-only' } } as Request;
    const res = createResponse();

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Username and password are required' });
  });

  it('returns 401 when user is not found during login', async () => {
    const req = {
      body: { username: 'missing-user', password: 'secret', role: 'Staff' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
  });

  it('returns 401 when selected role does not match the user role', async () => {
    const req = {
      body: { username: 'admin-user', password: 'secret', role: 'Staff' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'user-1',
      username: 'admin-user',
      passwordHash: 'hash',
      role: 'ADMIN',
    });

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Role mismatch' });
  });

  it('returns 401 when password verification fails', async () => {
    const req = {
      body: { username: 'staff-user', password: 'wrong', role: 'Staff' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'user-2',
      username: 'staff-user',
      passwordHash: 'hash',
      role: 'STAFF',
    });
    mockedVerifyPassword.mockResolvedValue(false);

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid password' });
  });

  it('rehashes legacy plain-text password and logs in successfully', async () => {
    const req = {
      body: { username: 'legacy-user', password: 'plain-secret', role: 'Owner' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'user-3',
      username: 'legacy-user',
      passwordHash: 'plain-secret',
      role: 'ADMIN',
    });
    mockedVerifyPassword.mockResolvedValue(true);
    mockedIsBcryptHash.mockReturnValue(false);
    mockedHashPassword.mockResolvedValue('new-bcrypt-hash');

    await login(req, res);

    expect(mockedPrisma.user.update).toHaveBeenCalledWith({
      where: { id: 'user-3' },
      data: { passwordHash: 'new-bcrypt-hash' },
    });
    expect(res.cookie).toHaveBeenCalledWith(
      'arrowhead_session',
      'signed-token',
      expect.objectContaining({ httpOnly: true })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Login successful',
      user: {
        id: 'user-3',
        username: 'legacy-user',
        role: 'ADMIN',
      },
    });
  });

  it('logs in successfully without rehash for bcrypt users', async () => {
    const req = {
      body: { username: 'staff-user', password: 'secret', role: 'Staff' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'user-4',
      username: 'staff-user',
      passwordHash: '$2b$10$someHashValue1234567890123456789012345678901234567890',
      role: 'STAFF',
    });
    mockedVerifyPassword.mockResolvedValue(true);
    mockedIsBcryptHash.mockReturnValue(true);

    await login(req, res);

    expect(mockedPrisma.user.update).not.toHaveBeenCalled();
    expect(mockedSignSessionToken).toHaveBeenCalledWith({
      id: 'user-4',
      username: 'staff-user',
      role: 'STAFF',
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('returns 500 on login unexpected error', async () => {
    const req = {
      body: { username: 'staff-user', password: 'secret', role: 'Staff' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockRejectedValue(new Error('db down'));

    await login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('returns 401 for me when auth user is missing', async () => {
    const req = {} as Request;
    const res = createResponse();

    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
  });

  it('returns 401 for me when session user no longer exists', async () => {
    const req = {
      authUser: { id: 'gone-user', username: 'x', role: 'STAFF' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue(null);

    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Session user no longer exists' });
  });

  it('returns current authenticated user in me endpoint', async () => {
    const req = {
      authUser: { id: 'user-5', username: 'staff-user', role: 'STAFF' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockResolvedValue({
      id: 'user-5',
      username: 'staff-user',
      role: 'STAFF',
    });

    await me(req, res);

    expect(mockedPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 'user-5' },
      select: {
        id: true,
        username: true,
        role: true,
      },
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      user: {
        id: 'user-5',
        username: 'staff-user',
        role: 'STAFF',
      },
    });
  });

  it('returns 500 for me endpoint when prisma throws', async () => {
    const req = {
      authUser: { id: 'user-6', username: 'staff-user', role: 'STAFF' },
    } as Request;
    const res = createResponse();

    mockedPrisma.user.findUnique.mockRejectedValue(new Error('query failure'));

    await me(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
  });

  it('clears session cookie and returns logout success', async () => {
    const req = {} as Request;
    const res = createResponse();

    await logout(req, res);

    expect(res.clearCookie).toHaveBeenCalledWith(
      'arrowhead_session',
      expect.objectContaining({
        httpOnly: true,
        path: '/',
        maxAge: undefined,
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Logged out successfully' });
  });
});
