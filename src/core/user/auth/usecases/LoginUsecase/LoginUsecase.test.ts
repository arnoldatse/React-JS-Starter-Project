import LoginUsecase from './LoginUsecase';
import AuthRepository from '../../repositories/AuthRepository';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import AuthDatas from '../../entities/AuthDatas';
import { StringsKeys } from 'core/internationalization/strings';
import LoginFailedExceptions from '../../exceptions/LoginFailedExceptions';
import routesPaths from 'core/routes/routesPaths';

describe('LoginUsecase', () => {
    let authRepository: AuthRepository;
    let sessionStorageService: SessionStorageService;
    let loginUsecase: LoginUsecase;
    let redirectCallBack: jest.Mock;
    let showErrorCallBack: jest.Mock;

    beforeEach(() => {
        authRepository = {
            login: jest.fn(),
        } as unknown as AuthRepository;

        sessionStorageService = {
            setPersist: jest.fn(),
            setUnpersist: jest.fn(),
            save: jest.fn(),
        } as unknown as SessionStorageService;

        loginUsecase = new LoginUsecase(authRepository, sessionStorageService);
        redirectCallBack = jest.fn();
        showErrorCallBack = jest.fn();
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

        loginUsecase.execute('user', 'password', true, redirectCallBack, showErrorCallBack);

    });

    it('should show bad credentials error on invalid credentials', done => {
        (authRepository.login as jest.Mock).mockRejectedValue(LoginFailedExceptions.INVALID_CREDENTIALS);

        showErrorCallBack.mockImplementation((stringkey: StringsKeys) => {
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(stringkey).toBe(StringsKeys.badCredentials);
            done();
        })

        loginUsecase.execute('user', 'password', true, redirectCallBack, showErrorCallBack);

    });

    it('should show unexpected or network error on other exceptions', done => {
        (authRepository.login as jest.Mock).mockRejectedValue(new Error('Network error'));

        showErrorCallBack.mockImplementation((stringkey: StringsKeys) => {
            expect(authRepository.login).toHaveBeenCalledWith('user', 'password');
            expect(stringkey).toBe(StringsKeys.unexpectedOrNetworkError);
            done();
        })

        loginUsecase.execute('user', 'password', true, redirectCallBack, showErrorCallBack);
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

        loginUsecase.execute('user', 'password', false, redirectCallBack, showErrorCallBack);
    });
});