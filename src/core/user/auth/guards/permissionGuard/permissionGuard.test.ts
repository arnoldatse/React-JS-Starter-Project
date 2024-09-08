import Roles from "core/user/auth/entities/Roles";
import Permissions from "../../entities/Permissions";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import permissionGuard from "./permissionGuard";
import StoreAuthDatasRepository from "core/user/auth/repositories/StoreAuthDatasRepository";
import AuthDatas from "core/user/auth/entities/AuthDatas";

describe('permissionGuard', () => {
    let mockStoreAuthDatasRepository: jest.Mocked<StoreAuthDatasRepository>;
    let sessionStorageService: SessionStorageService;
    let sessionStorageService_spy_authDatas: jest.SpyInstance<AuthDatas | null, []>

    beforeEach(() => {
        mockStoreAuthDatasRepository = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        };
        sessionStorageService = SessionStorageService.getInstance(mockStoreAuthDatasRepository);
    });

    it('should return true if the user has the required permission', () => {
        sessionStorageService_spy_authDatas = jest.spyOn(sessionStorageService, 'authDatas', 'get').mockReturnValue({
            id: 1,
            username: 'Jhon Doe',
            token: 'token',
            role: Roles.Admin
        });
        const hasPermission = permissionGuard(sessionStorageService, Permissions.DASHBOARD);

        expect(sessionStorageService_spy_authDatas).toHaveBeenCalled();
        expect(hasPermission).toBe(true);
    });

    it('should return false if the user does not have the required permission', () => {
        sessionStorageService_spy_authDatas = jest.spyOn(sessionStorageService, 'authDatas', 'get').mockReturnValue({
            id: 1,
            username: 'Jhon Doe',
            token: 'token',
            role: Roles.Supervisor
        });

        const hasPermission = permissionGuard(sessionStorageService, Permissions.DASHBOARD);

        expect(sessionStorageService_spy_authDatas).toHaveBeenCalled();
        expect(hasPermission).toBe(false);
    });

    it('should return false if the user role is undefined', () => {
        sessionStorageService_spy_authDatas = jest.spyOn(sessionStorageService, 'authDatas', 'get').mockReturnValue(null);

        const hasPermission = permissionGuard(sessionStorageService, Permissions.DASHBOARD);

        expect(sessionStorageService_spy_authDatas).toHaveBeenCalled();
        expect(hasPermission).toBe(false);
    });
});