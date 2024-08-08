import DefaultExceptions from 'core/exceptions/DefaultExceptions';
import AuthRepositoryBackend from './AuthRepositoryBackend';
import HttpRequestAdapter from 'core/httpRequest/HttpRequestAdapter';
import LoginFailedExceptions from 'core/user/auth/exceptions/LoginFailedExceptions';
import { loginUrl, logoutUrl } from 'details/datas/backend/rest/api/backend_endpoints';

jest.mock('details/env/vite/ViteEnvAdapter', () => jest.fn().mockImplementation(() => (
    {
        get: jest.fn().mockImplementation(() => 'http://testbackend:8080')
    }
)))

describe('AuthRepositoryBackend', () => {
  let httpRequest: jest.Mocked<HttpRequestAdapter>;
  let authRepository: AuthRepositoryBackend;

  beforeEach(() => {
    httpRequest = {
        get: jest.fn(),
        post: jest.fn(),
        patch: jest.fn(),
        put: jest.fn(),
        delete: jest.fn(),
    }
    authRepository = new AuthRepositoryBackend(httpRequest);
  });

  describe('login', () => {
    it('should return AuthDatas on successful login', async () => {
      const loginResponse = {
        user: {
          id: '1',
          name: 'John Doe',
          email: 'john.doe@example.com',
          role: 'user',
        },
        token: 'fake-token',
      };

      httpRequest.post.mockResolvedValue(loginResponse);

      const result = await authRepository.login('john.doe@example.com', 'password');

      expect(httpRequest.post).toHaveBeenCalledWith({
        url: loginUrl(),
        body: { email: 'john.doe@example.com', password: 'password' },
      });
      expect(result).toEqual({
        id: '1',
        username: 'John Doe',
        role: 'user',
        token: 'fake-token',
      });
    });

    it('should throw INVALID_CREDENTIALS on 401 error', async () => {
      const error = {
        status: 401,
        response: { error: 'Invalid credentials' },
      };

      httpRequest.post.mockRejectedValue(error);

      await expect(authRepository.login('john.doe@example.com', 'wrong-password')).rejects.toBe(LoginFailedExceptions.INVALID_CREDENTIALS);
    });

    it('should throw UNKNOWN_ERROR on other errors', async () => {
      const error = {
        status: 500,
        response: { error: 'Server error' },
      };

      httpRequest.post.mockRejectedValue(error);

      await expect(authRepository.login('john.doe@example.com', 'password')).rejects.toBe(DefaultExceptions.UNKNOWN_ERROR);
    });
  });

  describe('logout', () => {
    it('should call the logout endpoint with the token', async () => {
      httpRequest.get.mockResolvedValue(undefined);

      await authRepository.logout('fake-token');

      expect(httpRequest.get).toHaveBeenCalledWith({
        url: logoutUrl('fake-token'),
      });
    });

    it('should throw UNKNOWN_ERROR on logout failure', async () => {
      httpRequest.get.mockRejectedValue(new Error('Network error'));

      await expect(authRepository.logout('fake-token')).rejects.toBe(DefaultExceptions.UNKNOWN_ERROR);
    });
  });
});