import LoginUseCase from './LoginUseCase';
import SessionStorageService from '../../services/sessionStorageService/SessionStorageService';
import AuthData from '../../entities/AuthData';
import DefaultExceptionType from 'core/exceptions/DefaultExceptionType';
import Roles from '../../entities/Role';
import StoreAuthDataRepository from '../../repositories/StoreAuthDataRepository';
import AuthRepository from '../../repositories/AuthRepository';

describe('LoginUseCase', () => {
    const defaultAuthData: AuthData = {
        id: 'testId',
        username: 'testUsername',
        email: 'test@email.com',
        role: Roles.ADMIN,
        token: 'testToken',
    }
    describe('execute', () => {
        let loginUseCase: LoginUseCase;
        let authRepositoryMock: jest.Mocked<AuthRepository>;
        let storeAuthDataRepositoryMock: jest.Mocked<StoreAuthDataRepository>;
        let sessionStorageService: SessionStorageService;

        beforeEach(() => {
            authRepositoryMock = {
                login: jest.fn(),
                logout: jest.fn(),
            };
            storeAuthDataRepositoryMock = {
                save: jest.fn(),
                get: jest.fn(),
                remove: jest.fn()
            };
            sessionStorageService = SessionStorageService.getInstance(storeAuthDataRepositoryMock);
            loginUseCase = new LoginUseCase(authRepositoryMock);
        });

        afterEach(() => {
            jest.clearAllMocks();
        });

        it('should execute login and save authenticated user with rememberMe true', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;

            authRepositoryMock.login.mockResolvedValue(defaultAuthData);
            const sessionStorageServiceSaveSpy = jest.spyOn(sessionStorageService, 'save').mockResolvedValue();
            const sessionStorageServiceEnablePersistSpy = jest.spyOn(sessionStorageService, 'enablePersist');

            await loginUseCase.execute(login, password, rememberMe);

            expect(authRepositoryMock.login).toHaveBeenCalledWith(login, password);
            expect(sessionStorageServiceSaveSpy).toHaveBeenCalledWith(defaultAuthData);
            expect(sessionStorageServiceEnablePersistSpy).toHaveBeenCalled();
        });

        it('should execute login and save authenticated user with rememberMe false', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = false;

            authRepositoryMock.login.mockResolvedValue(defaultAuthData);
            const sessionStorageServiceDisablePersistSpy = jest.spyOn(sessionStorageService, 'disablePersist');
            const sessionStorageServiceSaveSpy = jest.spyOn(sessionStorageService, 'save').mockResolvedValue();

            await loginUseCase.execute(login, password, rememberMe);

            expect(authRepositoryMock.login).toHaveBeenCalledWith(login, password);
            expect(sessionStorageServiceDisablePersistSpy).toHaveBeenCalled();
            expect(sessionStorageServiceSaveSpy).toHaveBeenCalledWith(defaultAuthData);
        });

        it('should throw an exception if login fails', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;
            const exception = { type: DefaultExceptionType.UNAUTHORIZED };

            authRepositoryMock.login.mockRejectedValue(exception);

            await expect(loginUseCase.execute(login, password, rememberMe)).rejects.toBe(exception);
        });

        it('should throw an unknown error if an unexpected error occurs', async () => {
            const login = 'testUser';
            const password = 'testPassword';
            const rememberMe = true;

            const execution = { type: DefaultExceptionType.UNKNOWN_ERROR, body: 'Unexpected error' };

            authRepositoryMock.login.mockResolvedValue(defaultAuthData);
            jest.spyOn(sessionStorageService, 'save').mockRejectedValue(execution);
        

            await expect(loginUseCase.execute(login, password, rememberMe)).rejects.toBe(execution);
        });
    });
});
