import AuthRepository from "core/user/auth/repositories/AuthRepository";
import { loginUrl, logoutUrl } from "details/datas/backend/rest/api/backend_endpoints";
import HttpRequestAdapter from "core/httpRequest/HttpRequestAdapter";
import Roles from "core/user/auth/entities/Roles";
import AuthDatas from "core/user/auth/entities/AuthDatas";

interface LoginFailedResponse {
  error: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginSuccessResponse {
  user: {
    id: string;
    name: string;
    email: string;
    role: Roles;
  };
  token: string;
}

interface LogoutFailedResponse {
  error: string;
}


export default class AuthRepositoryBackend implements AuthRepository {
  constructor(private httpRequest: HttpRequestAdapter) { }

  login(email: string, password: string): Promise<AuthDatas> {
    return this.httpRequest.post<LoginSuccessResponse, LoginFailedResponse, LoginRequest>({
      url: loginUrl(),
      body: { email, password }
    }).then(response => ({
      id: response.user.id,
      username: response.user.name,
      role: response.user.role,
      token: response.token
    }));
  }
  logout(token: string): Promise<void> {
    return this.httpRequest.get<void, LogoutFailedResponse>({
      url: logoutUrl(token),
    })
  }
}
