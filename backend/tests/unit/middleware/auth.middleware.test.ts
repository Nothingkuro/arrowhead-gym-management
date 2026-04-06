import type { NextFunction, Request, Response } from 'express';

jest.mock('../../../src/utils/auth', () => ({
  getSessionCookieName: jest.fn(),
  verifySessionToken: jest.fn(),
}));

import { requireAuth } from '../../../src/middleware/auth.middleware';
import { getSessionCookieName, verifySessionToken } from '../../../src/utils/auth';

describe('auth middleware', () => {
  const mockedGetSessionCookieName = getSessionCookieName as jest.Mock;
  const mockedVerifySessionToken = verifySessionToken as jest.Mock;

  function createResponse(): Response {
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;

    return res;
  }

  function createRequest(
    cookieToken?: string,
    authHeader?: string
  ): Request {
    return {
      cookies: cookieToken ? { session_cookie: cookieToken } : {},
      header: jest.fn().mockImplementation((name: string) =>
        name === 'Authorization' ? authHeader : undefined
      ),
    } as unknown as Request;
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetSessionCookieName.mockReturnValue('session_cookie');
  });

  it('authenticates request with session cookie token', () => {
    const req = createRequest('cookie-token');
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedVerifySessionToken.mockReturnValue({
      sub: 'user-1',
      username: 'staff-one',
      role: 'STAFF',
    });

    requireAuth(req, res, next);

    expect(mockedVerifySessionToken).toHaveBeenCalledWith('cookie-token');
    expect(req.authUser).toEqual({
      id: 'user-1',
      username: 'staff-one',
      role: 'STAFF',
    });
    expect(next).toHaveBeenCalledTimes(1);
    expect((res.status as jest.Mock)).not.toHaveBeenCalled();
  });

  it('authenticates request with bearer token when cookie is missing', () => {
    const req = createRequest(undefined, 'Bearer header-token');
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedVerifySessionToken.mockReturnValue({
      sub: 'user-2',
      username: 'admin-one',
      role: 'ADMIN',
    });

    requireAuth(req, res, next);

    expect(mockedVerifySessionToken).toHaveBeenCalledWith('header-token');
    expect(req.authUser).toEqual({
      id: 'user-2',
      username: 'admin-one',
      role: 'ADMIN',
    });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('prefers cookie token over bearer token when both are present', () => {
    const req = createRequest('cookie-token', 'Bearer header-token');
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedVerifySessionToken.mockReturnValue({
      sub: 'user-3',
      username: 'staff-two',
      role: 'STAFF',
    });

    requireAuth(req, res, next);

    expect(mockedVerifySessionToken).toHaveBeenCalledWith('cookie-token');
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('returns 401 when no auth token is provided', () => {
    const req = createRequest();
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
  });

  it('returns 401 when token verification fails', () => {
    const req = createRequest(undefined, 'Bearer invalid-token');
    const res = createResponse();
    const next = jest.fn() as NextFunction;

    mockedVerifySessionToken.mockImplementation(() => {
      throw new Error('invalid token');
    });

    requireAuth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired session' });
  });
});
