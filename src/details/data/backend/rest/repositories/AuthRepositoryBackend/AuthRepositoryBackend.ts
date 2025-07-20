import { FetchHttpRequest, FetchRequestOptions } from "http-repository-cache";
import AuthRepository from "core/authUser/auth/repositories/AuthRepository";
import Roles from "core/authUser/auth/entities/Role";
import AuthData from "core/authUser/auth/entities/AuthData";
import { loginUrl, logoutUrl } from "details/data/backend/rest/api/authBackendEndpoints/authBackendEndpoints";
import handleRequestError from "../../http/services/handleRequestError/handleRequestError";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  user: {
    id: string;
    username: string;
    email: string;
    role: Roles;
  };
  token: string;
}


export default class AuthRepositoryBackend implements AuthRepository {
  constructor(private readonly httpRequest: FetchHttpRequest<FetchRequestOptions>) { }

  login(email: string, password: string): Promise<AuthData> {
    return this.httpRequest.post<LoginSuccessResponse, LoginRequest>({
      url: loginUrl(),
      body: { email, password }
    }).then(response => ({
      id: response.user.id,
      username: response.user.username,
      email: response.user.email,
      role: response.user.role,
      token: response.token
    })).catch(handleRequestError);
  }
  
  logout(token: string): Promise<void> {
    return this.httpRequest.get<void>({
      url: logoutUrl(token),
    }).catch(handleRequestError);
  }
}
