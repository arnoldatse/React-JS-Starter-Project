import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import AuthRepository from "../../repositories/AuthRepository";
import AuthDatas from "../../entities/AuthDatas";
import { StringsKeys } from "core/internationalization/strings";
import LoginFailedExceptions from "../../exceptions/LoginFailedExceptions";
import routesPaths from "core/routes/routesPaths";

export default class LoginUsecase {
  constructor(
    private authRepository: AuthRepository,
    private sessionStorageService: SessionStorageService
  ) { }

  execute(login: string, password: string, rememberMe: boolean, redirectCallBack: (routePath: string) => void, showErrorCallBack: (stringkey: StringsKeys) => void): void {
    this.authRepository
      .login(login, password)
      .then(async (authDatas) => {
        await this.saveAuthenticatedUser(authDatas, rememberMe)
        redirectCallBack(routesPaths.DASHBOARD.HOME);
      })
      .catch((e: LoginFailedExceptions) => {
        if (e === LoginFailedExceptions.INVALID_CREDENTIALS) {
          showErrorCallBack(StringsKeys.badCredentials);
        }
        else {
          showErrorCallBack(StringsKeys.unexpectedOrNetworkError);
        }
      })
  }

  private async saveAuthenticatedUser(authDatas: AuthDatas, rememberMe: boolean) {
    //defined if the user wants to persist the session
    rememberMe ? this.sessionStorageService.setPersist() : this.sessionStorageService.setUnpersist()

    //save the authentication datas to the session
    await this.sessionStorageService.save(authDatas);
  }
}
