import StoreAuthDataRepository from "core/authUser/auth/repositories/StoreAuthDataRepository";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import guestGuard from "./guestGuard";

describe('guestGuard', () => {
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

    it('should return false when user is authenticated', () => {
        // Mock isAuthenticated to return true
        const sessionStorageServiceIsAuthenticatedSpy = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(true);

        const isGuest = guestGuard(sessionStorageService);

        expect(sessionStorageServiceIsAuthenticatedSpy).toHaveBeenCalled();
        expect(isGuest).toBe(false);
    });

    it('should return true when user is not authenticated', () => {
        // Mock isAuthenticated to return false
        const sessionStorageServiceIsAuthenticatedSpy = jest.spyOn(sessionStorageService, 'isAuthenticated', 'get').mockReturnValue(false);

        const isGuest = guestGuard(sessionStorageService);

        expect(sessionStorageServiceIsAuthenticatedSpy).toHaveBeenCalled();
        expect(isGuest).toBe(true);
    });
});