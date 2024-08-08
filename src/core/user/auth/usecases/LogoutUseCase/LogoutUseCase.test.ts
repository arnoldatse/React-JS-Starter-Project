import LogoutUseCase from './LogoutUseCase';
import AuthRepository from 'core/user/auth/repositories/AuthRepository';
import SessionStorageService from 'core/user/auth/services/sessionStorageService/SessionStorageService';
import routesPaths from 'core/routes/routesPaths';
import StoreAuthDatasRepository from 'core/user/auth/repositories/StoreAuthDatasRepository';

describe('LogoutUseCase', () => {
    let logoutUsecase: LogoutUseCase;
    let authRepositoryMock: jest.Mocked<AuthRepository>;
    let sessionStorageService: SessionStorageService;
    let storeAuthDatasRepositoryMock: jest.Mocked<StoreAuthDatasRepository>;

    beforeEach(() => {
        authRepositoryMock = {
            signIn: jest.fn(),
            logout: jest.fn()
        };
        storeAuthDatasRepositoryMock = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        }
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepositoryMock);
        logoutUsecase = new LogoutUseCase(authRepositoryMock, sessionStorageService);
    });

    it('should remove authenticated user and redirect user to login page on logout', () => {
        const sessionStorageService_spy_remove = jest.spyOn(sessionStorageService, 'remove');

        const redirect = jest.fn();
        const showLogoutError = jest.fn();

        // Execute the logout use case
        logoutUsecase.execute(redirect, showLogoutError);
        
        expect(sessionStorageService_spy_remove).toHaveBeenCalledTimes(1);
        expect(redirect).toHaveBeenCalledWith(routesPaths.LOGIN.ROOT);
    });
});