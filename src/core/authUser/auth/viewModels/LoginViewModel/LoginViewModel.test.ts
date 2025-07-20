import ExceptionService from 'core/exceptions/exceptionService/ExceptionService';
import DefaultExceptionType from 'core/exceptions/DefaultExceptionType';
import DashboardNavigationLocation from 'core/navigation/DashboardNavigationLocation';
import { StringsKey } from 'core/internationalization/strings';
import Exception from 'core/exceptions/Exception';
import AppNavigator from 'core/navigation/AppNavigator';
import AuthRepository from '../../repositories/AuthRepository';
import LoginUseCase from '../../useCases/LoginUseCase/LoginUseCase'
import LoginViewModel from './LoginViewModel';

jest.useFakeTimers();
describe('LoginViewModel', () => {
    let loginViewModel: LoginViewModel;
    let authRepository: jest.Mocked<AuthRepository>;
    let navigator: jest.Mocked<AppNavigator>;
    let translate: jest.Mock;

    beforeEach(() => {
        authRepository = {
            login: jest.fn(),
            logout: jest.fn(),
        };
        navigator = {
            navigate: jest.fn(),
            clearHistoryAndNavigate: jest.fn(),
            redirect: jest.fn(),
            clearHistory: jest.fn(),
            canNavigateToPreviousLocation: jest.fn(),
            navigateToPreviousLocation: jest.fn(),
            canNavigateToNextLocation: jest.fn(),
            navigateToNextLocation: jest.fn(),
            getPreviousLocation: jest.fn(),
            getNextLocation: jest.fn(),
            getCurrentLocation: jest.fn(),
        };
        translate = jest.fn();

        loginViewModel = new LoginViewModel(authRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Get loggingIn', () => {
        it('Should get loggingIng return true when LoginViewModel just instantiated', () => {
            expect(loginViewModel.loggingIn).toBe(false);
        });

        it('Should get loggingIng return true when LoginViewModel is loggingIn', () => {
            jest.spyOn(LoginUseCase.prototype, 'execute').mockImplementation(() => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            });
            loginViewModel.submit('email', 'password', true, navigator, translate);
            expect(loginViewModel.loggingIn).toBe(true);
        });
    });

    describe('Get failedLoggingInException', () => {
        it('Should get loggingInException return null when LoginViewModel just instantiated', () => {
            expect(loginViewModel.failedLoggingInException).toBe(null);
        });

        it('Should get loggingInException return exception when LoginViewModel has exception', async () => {
            const exception: Exception = { type: DefaultExceptionType.UNAUTHORIZED, message: 'Unauthorized' };
            const loginViewModelExecuteMock = jest.spyOn(LoginUseCase.prototype, 'execute').mockRejectedValue(exception);
            translate.mockImplementation((key: StringsKey) => key);

            ExceptionService.handleException = jest.fn().mockReturnValue(exception);

            try {
                await loginViewModel.submit('email', 'password', true, navigator, translate);
            } catch (_) {
                expect(loginViewModelExecuteMock).toHaveBeenCalled();
                expect(loginViewModel.failedLoggingInException).toBe(exception);
            }
        });
    });

    describe('Submit', () => {
        const email = 'test@example.com';
        const password = 'password';
        const rememberMe = true;

        it('Should reset loggingIn and loggingInException states before login', async () => {
            jest.spyOn(LoginUseCase.prototype, 'execute').mockResolvedValueOnce(undefined);
            await loginViewModel.submit(email, password, rememberMe, navigator, translate);
            expect(loginViewModel.failedLoggingInException).toBe(null);
            expect(loginViewModel.loggingIn).toBe(false);
        });

        it('Should navigate to dashboard on successful login', async () => {
            jest.spyOn(LoginUseCase.prototype, 'execute').mockResolvedValueOnce(undefined);
            await loginViewModel.submit(email, password, rememberMe, navigator, translate);
            expect(navigator.navigate).toHaveBeenCalledWith(DashboardNavigationLocation.DASHBOARD);
        });

        it('Should handle exception on login failure', async () => {
            const exception: Exception = { type: DefaultExceptionType.UNAUTHORIZED, message: 'Unauthorized' };
            jest.spyOn(LoginUseCase.prototype, 'execute').mockRejectedValue(exception);
            ExceptionService.handleException = jest.fn().mockReturnValue(exception);
            await expect(loginViewModel.submit(email, password, rememberMe, navigator, translate)).rejects.toBe(exception);
            expect(loginViewModel.failedLoggingInException).toBe(exception);
        });

        it('Should reset loggingIn state after login attempt', async () => {
            jest.spyOn(LoginUseCase.prototype, 'execute').mockResolvedValueOnce(undefined);
            await loginViewModel.submit(email, password, rememberMe, navigator, translate);
            expect(loginViewModel.loggingIn).toBe(false);
        });
    });
});