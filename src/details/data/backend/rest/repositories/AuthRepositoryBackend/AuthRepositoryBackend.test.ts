import { FetchHttpRequest } from "http-repository-cache";
import AuthData from "core/authUser/auth/entities/AuthData";
import Roles from "core/authUser/auth/entities/Role";
import { loginUrl, logoutUrl } from "details/data/backend/rest/api/authBackendEndpoints/authBackendEndpoints";
import handleRequestError from "../../http/services/handleRequestError/handleRequestError";
import AuthRepositoryBackend from "./AuthRepositoryBackend";

jest.mock("http-repository-cache");
jest.mock("details/data/backend/rest/api/authBackendEndpoints/authBackendEndpoints");
jest.mock("../../http/services/handleRequestError/handleRequestError");

describe("AuthRepositoryBackend", () => {
  let httpRequestMock: jest.Mocked<FetchHttpRequest>;
  let authRepository: AuthRepositoryBackend;

  beforeEach(() => {
    httpRequestMock = {
      post: jest.fn(),
      get: jest.fn(),
    } as unknown as jest.Mocked<FetchHttpRequest>;
    authRepository = new AuthRepositoryBackend(httpRequestMock);
  });

  describe("login", () => {
    it("should call httpRequest.post with correct parameters and return AuthData on success", async () => {
      const email = "test@example.com";
      const password = "password123";
      const mockResponse = {
        user: {
          id: "1",
          username: "testuser",
          email: "test@example.com",
          role: Roles.ADMIN,
        },
        token: "mockToken",
      };
      (loginUrl as jest.Mock).mockReturnValue("mockLoginUrl");
      httpRequestMock.post.mockResolvedValue(mockResponse);

      const result = await authRepository.login(email, password);

      expect(httpRequestMock.post).toHaveBeenCalledWith({
        url: "mockLoginUrl",
        body: { email, password },
      });
      expect(result).toEqual<AuthData>({
        id: "1",
        username: "testuser",
        email: "test@example.com",
        role: Roles.ADMIN,
        token: "mockToken",
      });
    });

    it("should call handleRequestError on failure", async () => {
      const email = "test@example.com";
      const password = "password123";
      const mockError = new Error("Login failed");
      (loginUrl as jest.Mock).mockReturnValue("mockLoginUrl");
      httpRequestMock.post.mockRejectedValue(mockError);
      try{
        await expect(authRepository.login(email, password)).rejects.toThrow(mockError);
      }
      catch (_) {
        expect(handleRequestError).toHaveBeenCalledWith(mockError);
      }
    });
  });

  describe("logout", () => {
    it("should call httpRequest.get with correct parameters", async () => {
      const token = "mockToken";
      const logoutUrlResponse = "mockLogoutUrl";
      (logoutUrl as jest.Mock).mockReturnValue(logoutUrlResponse);
      httpRequestMock.get.mockResolvedValue(undefined);

      await authRepository.logout(token);

      expect(logoutUrl).toHaveBeenCalledWith(token);
      expect(httpRequestMock.get).toHaveBeenCalledWith({
        url: logoutUrlResponse,
      });
    });

    it("should call handleRequestError on failure", async () => {
      const token = "mockToken";
      const mockError = new Error("Logout failed");
      (logoutUrl as jest.Mock).mockReturnValue("mockLogoutUrl");
      httpRequestMock.get.mockRejectedValue(mockError);
      try{
        await expect(authRepository.logout(token)).rejects.toThrow(mockError);
      }
      catch (_) {
        expect(handleRequestError).toHaveBeenCalledWith(mockError);
      }
    });
  });
});