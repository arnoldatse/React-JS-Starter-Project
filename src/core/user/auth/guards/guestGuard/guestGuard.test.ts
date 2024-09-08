import StoreAuthDatasRepository from "core/user/auth/repositories/StoreAuthDatasRepository";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import guestGuard from "./guestGuard";

describe('guestGuard', () => {
    let mockStoreAuthDatasRepository: jest.Mocked<StoreAuthDatasRepository>;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
        mockStoreAuthDatasRepository = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        };
        sessionStorageService = SessionStorageService.getInstance(mockStoreAuthDatasRepository);
    });

    it('should return false when user is authenticated', () => {
        // Mock isAuthenticated to return true
        jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);

        const isGuest = guestGuard(sessionStorageService);

        expect(isGuest).toBe(false);
    });

    it('should return true when user is not authenticated', () => {
        // Mock isAuthenticated to return false
        jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);

        const isGuest = guestGuard(sessionStorageService);

        expect(isGuest).toBe(true);
    });
});