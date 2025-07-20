import StoreAuthDataRepository from "../../repositories/StoreAuthDataRepository";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import authGuard from "./authGuard";

describe('authGuard', () => {
    let sessionStorageService: SessionStorageService;
    let storeAuthDataRepositoryMock: jest.Mocked<StoreAuthDataRepository>;

    beforeEach(() => {
        storeAuthDataRepositoryMock = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        };
        sessionStorageService = SessionStorageService.getInstance(storeAuthDataRepositoryMock);
    });

    it('should return true when user is authenticated', () => {
        // Mock isAuthenticated to return true
        const sessionStorageServiceIsAuthenticatedSpy = jest.spyOn(SessionStorageService.prototype, 'isAuthenticated', 'get').mockReturnValue(true);

        const isAuth = authGuard(sessionStorageService);

        expect(sessionStorageServiceIsAuthenticatedSpy).toHaveBeenCalled();
        expect(isAuth).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
        // Mock isAuthenticated to return true
        const sessionStorageServiceIsAuthenticatedSpy = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);

        const isAuth = authGuard(sessionStorageService);
        
        expect(sessionStorageServiceIsAuthenticatedSpy).toHaveBeenCalled();
        expect(isAuth).toBe(false);
    });
});