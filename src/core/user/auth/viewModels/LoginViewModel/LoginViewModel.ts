import AuthRepository from "../../repositories/AuthRepository";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import LoginUsecase from "../../usecases/LoginUsecase/LoginUsecase";
import { StringsKeys } from "core/internationalization/strings";

class LoginViewModel {
    private loginUseCase: LoginUsecase;

    constructor(
        authRepository: AuthRepository,
        sessionStorageService: SessionStorageService
    ) {
        this.loginUseCase = new LoginUsecase(authRepository, sessionStorageService);
    }

    submit(email: string, password: string, rememberMe: boolean, redirectCallBack: (path: string) => void, loginErrorCallBack: (errorMessage: string) => void, translateCallBack: (key: StringsKeys) => string) {

        const failedCallBack = (stringkey: StringsKeys) => {
            loginErrorCallBack(translateCallBack(stringkey));
        }
        this.loginUseCase.execute(email, password, rememberMe, redirectCallBack, failedCallBack)
    }
}

export default LoginViewModel;