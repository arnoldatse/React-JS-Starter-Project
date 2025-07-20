import Exception from "core/exceptions/Exception";
import ExceptionService from "core/exceptions/exceptionService/ExceptionService";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";
import { StringsKey } from "core/internationalization/strings";
import AppNavigator from "core/navigation/AppNavigator";
import DashboardNavigationLocation from "core/navigation/DashboardNavigationLocation";
import AuthRepository from "../../repositories/AuthRepository";
import LoginUseCase from "../../useCases/LoginUseCase/LoginUseCase";

class LoginViewModel {
    private _loggingIn: boolean = false;
    private _failedLoggingInException: Exception | null = null;

    constructor(
        private readonly authRepository: AuthRepository
    ) {}

    get loggingIn() {
        return this._loggingIn;
    }

    get failedLoggingInException() {
        return this._failedLoggingInException;
    }

    
    /**
     * Handles the login process by submitting the user's credentials and navigating to the dashboard upon success.
     * Resets the logging state and handles exceptions during the login process.
     *
     * @param email - The email address of the user attempting to log in.
     * @param password - The password of the user attempting to log in.
     * @param rememberMe - A boolean indicating whether the user should remain logged in across sessions.
     * @param navigator - An instance of `AppNavigator` used to navigate between application screens.
     * @param translate - A function that translates string keys into localized messages.
     * @returns A promise that resolves when the login process completes successfully or rejects with an exception if it fails.
     *
     * @throws {Exception<undefined, DefaultExceptionType>} Throws an exception if the login process fails, with a localized error message.
     */
    submit(email: string, password: string, rememberMe: boolean, navigator: AppNavigator, translate: (key: StringsKey) => string) {
        //reset loggingIn and loggingInException states before login
        this._failedLoggingInException = null;
        this._loggingIn = true

        return new LoginUseCase(this.authRepository).execute(email, password, rememberMe).then(() => {
            navigator.navigate(DashboardNavigationLocation.DASHBOARD);
        }).catch((e: Exception<undefined, DefaultExceptionType>) => {
            //generate exception message
            this._failedLoggingInException = ExceptionService.handleException<undefined, DefaultExceptionType>(e, translate, (exceptionType: DefaultExceptionType) => {
                if (exceptionType === DefaultExceptionType.UNAUTHORIZED) {
                    return translate(StringsKey.badCredentials);
                }
                return null;
            });
            throw this._failedLoggingInException;
        }).finally(() => {
            this._loggingIn = false;
        });
    }
}

export default LoginViewModel;