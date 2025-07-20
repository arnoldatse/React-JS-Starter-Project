import Roles from "core/authUser/auth/entities/Role";
import StoreAuthDataRepository from "core/authUser/auth/repositories/StoreAuthDataRepository";
import Permission from "../../entities/Permission";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import permissionGuard from "./permissionGuard";

describe('permissionGuard', () => {
    let storeAuthDataRepositoryMock: jest.Mocked<StoreAuthDataRepository>;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
        storeAuthDataRepositoryMock = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        };
        sessionStorageService = SessionStorageService.getInstance(storeAuthDataRepositoryMock);
    });

    it('should return true if the user has the required permission', () => {
        const sessionStorageServiceAuthDataSpy = jest.spyOn(sessionStorageService, 'authData', 'get').mockReturnValue({
            id: 1,
            username: 'Jhon Doe',
            token: 'token',
            email: 'jhondoe@email,com',
            role: Roles.ADMIN
        });
        const hasPermission = permissionGuard(sessionStorageService, Permission.WRITE);

        expect(sessionStorageServiceAuthDataSpy).toHaveBeenCalled();
        expect(hasPermission).toBe(true);
    });

    it('should return false if the user does not have the required permission', () => {
        const sessionStorageServiceAuthDataSpy = jest.spyOn(sessionStorageService, 'authData', 'get').mockReturnValue({
            id: 1,
            username: 'Jhon Doe',
            token: 'token',
            email: 'jhondoe@email,com',
            role: 1000 as Roles
        });

        const hasPermission = permissionGuard(sessionStorageService, Permission.WRITE);

        expect(sessionStorageServiceAuthDataSpy).toHaveBeenCalled();
        expect(hasPermission).toBe(false);
    });

    it('should return false if the user role is undefined', () => {
        const sessionStorageServiceAuthDataSpy = jest.spyOn(sessionStorageService, 'authData', 'get').mockReturnValue(null);

        const hasPermission = permissionGuard(sessionStorageService, Permission.WRITE);

        expect(sessionStorageServiceAuthDataSpy).toHaveBeenCalled();
        expect(hasPermission).toBe(false);
    });
});