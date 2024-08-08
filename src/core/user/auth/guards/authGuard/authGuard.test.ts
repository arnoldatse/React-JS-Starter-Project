import StoreAuthDatasRepository from "core/user/auth/repositories/StoreAuthDatasRepository";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import authGuard from "./authGuard";

describe('authGuard', () => {
    let mockStoreAuthDatasRepository: jest.Mocked<StoreAuthDatasRepository>;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
        mockStoreAuthDatasRepository = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        }
        sessionStorageService = SessionStorageService.getInstance(mockStoreAuthDatasRepository, true);
    });

    it('should return true when user is authenticated', () => {
        // Mock isAuthenticated to return true
        const sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);

        const isAuth = authGuard(sessionStorageService);

        expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
        expect(isAuth).toBe(true);
    });

    it('should return false when user is not authenticated', () => {
        // Mock isAuthenticated to return true
        const sessionStorageService_spy_isAuthenticated = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);

        const isAuth = authGuard(sessionStorageService);
        expect(sessionStorageService_spy_isAuthenticated).toHaveBeenCalled();
        expect(isAuth).toBe(false);
    });
});