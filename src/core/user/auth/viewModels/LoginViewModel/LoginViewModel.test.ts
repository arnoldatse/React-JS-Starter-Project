import LoginViewModel from './LoginViewModel';
import AuthRepository from '../../repositories/AuthRepository';
import LoginUsecase from '../../usecases/LoginUsecase/LoginUsecase'
import ExceptionService from 'core/exceptions/exceptionService/ExceptionService';
import DefaultExceptionTypes from 'core/exceptions/DefaultExceptionTypes';
import routesPaths from 'core/routes/routesPaths';
import { StringsKeys } from 'core/internationalization/strings';
import Exception from 'core/exceptions/Exception';

jest.mock('../../usecases/LoginUsecase/LoginUsecase');
jest.mock('core/exceptions/exceptionService/ExceptionService');

jest.useFakeTimers();
describe('LoginViewModel', () => {
    let loginViewModel: LoginViewModel;
    let authRepository: jest.Mocked<AuthRepository>;
    let navigate: jest.Mock;
    let translate: jest.Mock;

    beforeEach(() => {
        authRepository = {
            login: jest.fn(),
            logout: jest.fn(),
        };
        navigate = jest.fn();
        translate = jest.fn();

        loginViewModel = new LoginViewModel(authRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('get logingIn', () => {
        it('should get logingIng return true when LoginViewModel just instanciated', () => {
            expect(loginViewModel.logingIn).toBe(false);
        });

        it('should get logingIng return true when LoginViewModel is logingIn', () => {
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;

            executeMock.mockImplementation(() => {
                return new Promise<void>((resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 1000);
                });
            });
            loginViewModel.submit('email', 'password', true, navigate, translate);
            expect(loginViewModel.logingIn).toBe(true);
        });
    });

    describe('get logingInException', () => {
        it('should get logingInException return null when LoginViewModel just instanciated', () => {
            expect(loginViewModel.failedlogingInException).toBe(null);
        });

        it('should get logingInException return exception when LoginViewModel has exception', async () => {
            const exception: Exception = { type: DefaultExceptionTypes.UNAUTHORIZED, message: 'Unauthorized' };
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;

            executeMock.mockRejectedValue(exception);
            translate.mockImplementation((key: StringsKeys) => key);

            (ExceptionService.handleException as jest.Mock).mockReturnValue(exception);

            try {
                await loginViewModel.submit('email', 'password', true, navigate, translate);
            } catch (e) {
                expect(loginViewModel.failedlogingInException).toBe(exception);
            }
        });
    });

    describe('submit', () => {
        const email = 'test@example.com';
        const password = 'password';
        const rememberMe = true;

        it('should reset logingIn and logingInException states before login', async () => {
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;
            executeMock.mockResolvedValueOnce(undefined);

            await loginViewModel.submit(email, password, rememberMe, navigate, translate);

            expect(loginViewModel.failedlogingInException).toBe(null);
            expect(loginViewModel.logingIn).toBe(false);
        });

        it('should navigate to dashboard on successful login', async () => {
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;
            executeMock.mockResolvedValueOnce(undefined);

            await loginViewModel.submit(email, password, rememberMe, navigate, translate);

            expect(navigate).toHaveBeenCalledWith(routesPaths.DASHBOARD.HOME);
        });

        it('should handle exception on login failure', async () => {
            const exception: Exception = { type: DefaultExceptionTypes.UNAUTHORIZED, message: 'Unauthorized' };
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;
            executeMock.mockRejectedValue(exception);

            (ExceptionService.handleException as jest.Mock).mockReturnValue(exception);

            await expect(loginViewModel.submit(email, password, rememberMe, navigate, translate)).rejects.toBe(exception);

            expect(loginViewModel.failedlogingInException).toBe(exception);
        });

        it('should reset logingIn state after login attempt', async () => {
            const executeMock: jest.Mock<Promise<void>> = (LoginUsecase as jest.Mock<LoginUsecase>).mock.instances[0].execute as jest.Mock<Promise<void>>;
            executeMock.mockResolvedValueOnce(undefined);

            await loginViewModel.submit(email, password, rememberMe, navigate, translate);

            expect(loginViewModel.logingIn).toBe(false);
        });
    });
});