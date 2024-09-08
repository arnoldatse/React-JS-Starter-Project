import AuthRepositoryBackend from './AuthRepositoryBackend';
import HttpRequestAdapter from 'core/httpRequest/HttpRequestAdapter';
import { loginUrl, logoutUrl } from 'details/datas/backend/rest/api/backend_endpoints';
import Roles from 'core/user/auth/entities/Roles';

jest.mock('core/httpRequest/HttpRequestAdapter');
jest.mock('details/env/vite/ViteEnvAdapter', () => {
  return jest.fn().mockImplementation(() => {
    return {
      get: jest.fn().mockReturnValue('http://localhost:3000')
    }
  });
});

describe('AuthRepositoryBackend', () => {
  let httpRequest: jest.Mocked<HttpRequestAdapter>;
  let authRepository: AuthRepositoryBackend;

  beforeEach(() => {
    httpRequest = {
      post: jest.fn(),
      get: jest.fn(),
      put: jest.fn(),
      patch: jest.fn(),
      delete: jest.fn(),
    }
    authRepository = new AuthRepositoryBackend(httpRequest);
  });

  describe('login', () => {
    it('should login successfully', async () => {
      const email = 'test@example.com';
      const password = 'password123';
      const mockResponse = {
        user: {
          id: '1',
          name: 'Test User',
          email: 'test@example.com',
          role: Roles.Admin,
        },
        token: 'token123',
      };

      httpRequest.post.mockResolvedValue(mockResponse);

      const result = await authRepository.login(email, password);

      expect(httpRequest.post).toHaveBeenCalledWith({
        url: loginUrl(),
        body: { email, password },
      });
      expect(result).toEqual({
        id: '1',
        username: 'Test User',
        role: Roles.Admin,
        token: 'token123',
      });
    });

    it('should handle login failure', async () => {
      const email = 'test@example.com';
      const password = 'wrongpassword';
      const mockError = { error: 'Invalid credentials' };

      httpRequest.post.mockRejectedValue(mockError);

      await expect(authRepository.login(email, password)).rejects.toEqual(mockError);
    });
  });

  describe('logout', () => {
    it('should logout successfully', async () => {
      const token = 'token123';

      httpRequest.get.mockResolvedValue(undefined);

      await authRepository.logout(token);

      expect(httpRequest.get).toHaveBeenCalledWith({
        url: logoutUrl(token),
      });
    });

    it('should handle logout failure', async () => {
      const token = 'token123';
      const mockError = { error: 'Logout failed' };

      httpRequest.get.mockRejectedValue(mockError);

      await expect(authRepository.logout(token)).rejects.toEqual(mockError);
    });
  });
});