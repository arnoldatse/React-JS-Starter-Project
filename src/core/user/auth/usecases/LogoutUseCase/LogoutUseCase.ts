import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";
import Exception from "core/exceptions/Exception";
import DefaultExceptionTypes from "core/exceptions/DefaultExceptionTypes";
import ExceptionService from "core/exceptions/exceptionService/ExceptionService";

export default class LogoutUsecase {
  constructor() { }
  // constructor(private authRepository: AuthRepository) { }

  execute(navigate: (path: string) => void, translate: (key: StringsKeys) => string) {
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
          navigate(routesPaths.LOGIN);
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

  private exceptionHandler(e: unknown, translate: (key: StringsKeys) => string) {
    let exception: Exception<unknown, DefaultExceptionTypes>;
    if ((e as Exception).type) {
      exception = e as Exception<unknown, DefaultExceptionTypes>;
    }
    else {
      exception = { type: DefaultExceptionTypes.UNKNOWN_ERROR, body: e };
    }

    return ExceptionService.handleException<unknown, DefaultExceptionTypes>(exception, translate)
  }
}
