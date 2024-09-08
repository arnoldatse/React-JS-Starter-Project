import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import AuthRepository from "../../repositories/AuthRepository";
import AuthDatas from "../../entities/AuthDatas";
import Exception from "core/exceptions/Exception";
import DefaultExceptionTypes from "core/exceptions/DefaultExceptionTypes";

export default class LoginUsecase {
  constructor(
    private authRepository: AuthRepository,
  ) { }

  /**
   * Executes the login use case.
   * 
   * @param login - The user's login.
   * @param password - The user's password.
   * @param rememberMe - Indicates whether to remember the user's login.
   * @returns A promise that resolves when the login use case is executed successfully.
   * @throws {Exception} If an exception occurs during the execution of the use case.
   */
  execute(login: string, password: string, rememberMe: boolean): Promise<void> {
    return this.authRepository
      .login(login, password)
      .then(async (authDatas) => {
        try {
          await this.saveAuthenticatedUser(authDatas, rememberMe)
        }
        catch (e) {
          if ((e as Exception).type) {
            throw e;
          }
          else {
            throw { type: DefaultExceptionTypes.UNKNOWN_ERROR, body: e };
          }
        }
      })
  }

  private async saveAuthenticatedUser(authDatas: AuthDatas, rememberMe: boolean) {
    const sessionStorageService = SessionStorageService.getInstance();
    //defined if the user wants to persist the session
    rememberMe ? sessionStorageService.setPersist() : sessionStorageService.setUnpersist()

    //save the authentication datas to the session
    await sessionStorageService.save(authDatas);
  }
}
