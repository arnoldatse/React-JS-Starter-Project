import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import AuthRepository from "../../repositories/AuthRepository";
import AuthData from "../../entities/AuthData";
import Exception from "core/exceptions/Exception";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";

export default class LoginUseCase {
  constructor(
    private readonly authRepository: AuthRepository,
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
  execute(login: string, password: string, rememberMe: boolean = true): Promise<void> {
    return this.authRepository
      .login(login, password)
      .then(async (authData) => {
        try {
          await this.saveAuthenticatedUser(authData, rememberMe)
        }
        catch (e) {
          if ((e as Exception).type) {
            throw e;
          }
          else {
            throw { type: DefaultExceptionType.UNKNOWN_ERROR, body: e };
          }
        }
      })
  }

  private async saveAuthenticatedUser(authData: AuthData, rememberMe: boolean) {
    const sessionStorageService = SessionStorageService.getInstance();
    //defined if the user wants to persist the session
    rememberMe ? sessionStorageService.enablePersist() : sessionStorageService.disablePersist();

    //save the authentication data to the session
    await sessionStorageService.save(authData);
  }
}
