import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import { StringsKey } from "core/internationalization/strings";
import Exception from "core/exceptions/Exception";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";
import ExceptionService from "core/exceptions/exceptionService/ExceptionService";
import AppNavigator from "core/navigation/AppNavigator";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";

export default class LogoutUseCase {
  // constructor(private authRepository: AuthRepository) { }

  execute(navigator: AppNavigator, translate: (key: StringsKey) => string) {
    return new Promise<void>((resolve, reject) => {
      try {
        const sessionStorageService = SessionStorageService.getInstance();

        /* this.authRepository.logout(sessionStorageService.authDatas!.token).then(() => {
          sessionStorageService.remove().then(() => {
            resolve();
          }).catch((e) => {
            reject(this.exceptionHandler(e));
          });
        }).catch((e) => {
          reject(this.exceptionHandler(e));
        }); */

        sessionStorageService.remove().then(() => {
          navigator.clearHistoryAndNavigate(PublicNavigationLocation.HOME);
          resolve();
        }).catch((e) => {
          reject(this.exceptionHandler(e, translate));
        });

      }
      catch (e) {
        reject(this.exceptionHandler(e, translate));
      }
    });

  }

  private exceptionHandler(e: unknown, translate: (key: StringsKey) => string) {
    let exception: Exception<unknown, DefaultExceptionType>;
    if ((e as Exception).type) {
      exception = e as Exception<unknown, DefaultExceptionType>;
    }
    else {
      exception = { type: DefaultExceptionType.UNKNOWN_ERROR, body: e };
    }

    return ExceptionService.handleException<unknown, DefaultExceptionType>(exception, translate)
  }
}
