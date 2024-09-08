import Exception from "core/exceptions/Exception";
import AuthRepository from "../../repositories/AuthRepository";
import LoginUsecase from "../../usecases/LoginUsecase/LoginUsecase";
import { StringsKeys } from "core/internationalization/strings";
import routesPaths from "core/routes/routesPaths";
import ExceptionService from "core/exceptions/exceptionService/ExceptionService";
import DefaultExceptionTypes from "core/exceptions/DefaultExceptionTypes";

class LoginViewModel {
    private loginUseCase: LoginUsecase;

    private _logingIn: boolean = false;
    private _failedlogingInException: Exception | null = null;

    constructor(
        authRepository: AuthRepository,
    ) {
        this.loginUseCase = new LoginUsecase(authRepository);
    }

    get logingIn() {
        return this._logingIn;
    }

    get failedlogingInException() {
        return this._failedlogingInException;
    }

    /**
     * Submits the login form with the provided email, password, rememberMe flag, and callback functions.
     * If the login attempt is successful, the user is redirected to the dashboard.
     * If the login attempt fails, the exceptionis rejected with translated message.
     * 
     * @param email - The email address of the user.
     * @param password - The password of the user.
     * @param rememberMe - A flag indicating whether to remember the user's login.
     * @param navigate - A callback function to navigate to a specific path after successful login.
     * @param translate - A callback function to translate string keys.
     * @returns A promise that resolves after the login attempt is completed.
     */
    submit(email: string, password: string, rememberMe: boolean, navigate: (path: string) => void, translate: (key: StringsKeys) => string) {
        //reset logingIn and logingInException states before login
        this._failedlogingInException = null;
        this._logingIn = true

        return this.loginUseCase.execute(email, password, rememberMe).then(() => {
            navigate(routesPaths.DASHBOARD.HOME);
        }).catch((e: Exception<undefined, DefaultExceptionTypes>) => {
            //generate exception message
            this._failedlogingInException = ExceptionService.handleException<undefined, DefaultExceptionTypes>(e, translate, (exceptionType: DefaultExceptionTypes) => {
                if (exceptionType === DefaultExceptionTypes.UNAUTHORIZED) {
                    return translate(StringsKeys.badCredentials);
                }
                return null;
            });
            throw this._failedlogingInException;
        }).finally(() => {
            this._logingIn = false;
        });
    }
}

export default LoginViewModel;