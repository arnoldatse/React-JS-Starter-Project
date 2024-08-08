import LoginViewModel from './LoginViewModel';
import AuthRepository from '../../repositories/AuthRepository';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import routesPaths from 'core/routes/routesPaths';
import LoginFailedExceptions from '../../exceptions/LoginFailedExceptions';
import AuthDatas from 'core/user/auth/entities/AuthDatas';
import { StringsKeys } from 'core/internationalization/strings';

describe('LoginViewModel', () => {
    let authRepository: AuthRepository;
    let sessionStorageService: SessionStorageService;
    let loginViewModel: LoginViewModel;
    let redirectCallBack: jest.Mock;
    let loginErrorCallBack: jest.Mock;
    let translateCallBack: jest.Mock;

    beforeEach(() => {
        authRepository = {
            login: jest.fn(),
        } as unknown as AuthRepository;

        sessionStorageService = {
            setPersist: jest.fn(),
            setUnpersist: jest.fn(),
            save: jest.fn(),
        } as unknown as SessionStorageService;

        loginViewModel = new LoginViewModel(authRepository, sessionStorageService);

        redirectCallBack = jest.fn();
        loginErrorCallBack = jest.fn();
        translateCallBack = jest.fn();
    });

    it('should redirect to dashboard on successful login', done => {
        const authDatas = {} as AuthDatas;
        (authRepository.login as jest.Mock).mockResolvedValue(authDatas);

        redirectCallBack.mockImplementation((routePath: string) => {
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(sessionStorageService.setPersist).toHaveBeenCalled();
            expect(sessionStorageService.setUnpersist).not.toHaveBeenCalled();
            expect(sessionStorageService.save).toHaveBeenCalledWith(authDatas);
            expect(routePath).toBe(routesPaths.DASHBOARD.HOME);
            done();
        });

        loginViewModel.submit('user', 'password', true, redirectCallBack, loginErrorCallBack, translateCallBack);
    });

    it('should show bad credentials error on invalid credentials', done => {
        (authRepository.login as jest.Mock).mockRejectedValue(LoginFailedExceptions.INVALID_CREDENTIALS);

        translateCallBack.mockReturnValue('Bad credentials');
        loginErrorCallBack.mockImplementation((errorMessage: string) => {
            expect(translateCallBack).toHaveBeenCalledWith(StringsKeys.badCredentials);
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(errorMessage).toBe('Bad credentials');
            done();
        });

        loginViewModel.submit('user', 'password', true, redirectCallBack, loginErrorCallBack, translateCallBack);
    });

    it('should show unexpected or network error on other exceptions', done => {
        (authRepository.login as jest.Mock).mockRejectedValue(new Error('Network error'));

        translateCallBack.mockReturnValue('Unexpected or network error');
        loginErrorCallBack.mockImplementation((errorMessage: string) => {
            expect(translateCallBack).toHaveBeenCalledWith(StringsKeys.unexpectedOrNetworkError);
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(errorMessage).toBe('Unexpected or network error');
            done();
        });

        loginViewModel.submit('user', 'password', true, redirectCallBack, loginErrorCallBack, translateCallBack);
    });

    it('should set unpersist if rememberMe is false', done => {
        const authDatas = {} as AuthDatas;
        (authRepository.login as jest.Mock).mockResolvedValue(authDatas);

        redirectCallBack.mockImplementation((routePath: string) => {
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(sessionStorageService.setUnpersist).toHaveBeenCalled();
            expect(sessionStorageService.setPersist).not.toHaveBeenCalled();
            expect(sessionStorageService.save).toHaveBeenCalledWith(authDatas);
            expect(routePath).toBe(routesPaths.DASHBOARD.HOME);
            done();
        });

        loginViewModel.submit('user', 'password', false, redirectCallBack, loginErrorCallBack, translateCallBack);
    });
});