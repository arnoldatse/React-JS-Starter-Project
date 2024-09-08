import LoginUsecase from './LoginUsecase';
import AuthRepository from '../../repositories/AuthRepository';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import AuthDatas from '../../entities/AuthDatas';
import DefaultExceptionTypes from 'core/exceptions/DefaultExceptionTypes';
import Roles from '../../entities/Roles';

jest.mock('../../repositories/AuthRepository');
jest.mock('../../services/sessionStorageService/SessionStorageService');


describe('LoginUsecase', () => {
    describe('execute', () => {
        let loginUsecase: LoginUsecase;
        let authRepository: jest.Mocked<AuthRepository>;
        let sessionStorageService: jest.Mocked<SessionStorageService>;

        beforeEach(() => {
            authRepository = {
                login: jest.fn(),
                logout: jest.fn(),
            };
            sessionStorageService = {
                setPersist: jest.fn(),
                setUnpersist: jest.fn(),
                save: jest.fn(),
            };
            (SessionStorageService.getInstance as jest.Mock).mockReturnValue(sessionStorageService);
            loginUsecase = new LoginUsecase(authRepository);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should execute login and save authenticated user with rememberMe true', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;
            const authDatas: AuthDatas = {
                id: 'testId',
                username: 'testUsername',
                role: Roles.Admin,
                token: 'testToken',
            };

            authRepository.login.mockResolvedValue(authDatas);
            sessionStorageService.save.mockResolvedValue();

            await loginUsecase.execute(login, password, rememberMe);

            expect(authRepository.login).toHaveBeenCalledWith(login, password);
            expect(sessionStorageService.setPersist).toHaveBeenCalled();
            expect(sessionStorageService.save).toHaveBeenCalledWith(authDatas);
        });

        it('should execute login and save authenticated user with rememberMe false', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = false;
            const authDatas: AuthDatas = {
                id: 'testId',
                username: 'testUsername',
                role: Roles.Supervisor,
                token: 'testToken',
            };

            authRepository.login.mockResolvedValue(authDatas);
            sessionStorageService.save.mockResolvedValue();

            await loginUsecase.execute(login, password, rememberMe);

            expect(authRepository.login).toHaveBeenCalledWith(login, password);
            expect(sessionStorageService.setUnpersist).toHaveBeenCalled();
            expect(sessionStorageService.save).toHaveBeenCalledWith(authDatas);
        });

        it('should throw an exception if login fails', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;
            const exception = { type: DefaultExceptionTypes.UNAUTHORIZED };

            authRepository.login.mockRejectedValue(exception);

            await expect(loginUsecase.execute(login, password, rememberMe)).rejects.toBe(exception);
        });

        it('should throw an unknown error if an unexpected error occurs', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;
            const authDatas: AuthDatas = {
                id: 'testId',
                username: 'testUsername',
                role: Roles.Supervisor,
                token: 'testToken',
            };
            const excetion = { type: DefaultExceptionTypes.UNKNOWN_ERROR, body: 'Unexpected error' };

            authRepository.login.mockResolvedValue(authDatas);
            sessionStorageService.save.mockRejectedValue(excetion);

            await expect(loginUsecase.execute(login, password, rememberMe)).rejects.toBe(excetion);
        });
    });
});
