import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import AuthRepository from "../../repositories/AuthRepository";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";

export default class LogoutUsecase {
  constructor(private authRepository: AuthRepository, private sessionStorageService: SessionStorageService) { }

  execute(redirectCallBack: (routePath: string) => void, showErrorCallBack: (stringkey: StringsKeys) => void) {
   /*  this.authRepository.logout().then(()=>{
      this.sessionStorageService.remove();
      redirect(routesPaths.LOGIN.ROOT);
    }).catch(() => {
      showErrorCallBack(StringsKeys.logoutFailed);
    }); */

    this.sessionStorageService.remove();
    redirectCallBack(routesPaths.LOGIN);
  }
}
