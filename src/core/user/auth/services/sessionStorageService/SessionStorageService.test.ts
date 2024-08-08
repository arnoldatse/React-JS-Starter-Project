import SessionStorageService from './SessionStorageService';
import StoreAuthDatasRepository from 'core/user/auth/repositories/StoreAuthDatasRepository';
import AuthDatas from 'core/user/auth/entities/AuthDatas';
import Roles from 'core/user/auth/entities/Roles';

const defaultAuthDatas: AuthDatas = { id: 1, username: "Jhon Doe", token: "some-token", role: Roles.Admin };


describe('SessionStorageService', () => {
    let storeAuthDatasRepositoryMock: jest.Mocked<StoreAuthDatasRepository>;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
        storeAuthDatasRepositoryMock = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()

        };
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepositoryMock, true);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getInstance returns a singleton instance', () => {
        const instance1 = SessionStorageService.getInstance(storeAuthDatasRepositoryMock);
        const instance2 = SessionStorageService.getInstance(storeAuthDatasRepositoryMock);
        expect(instance1).toBe(instance2);
    });

    test('setPersist and setUnpersist correctly set _persist', () => {
        sessionStorageService.setPersist();
        expect(sessionStorageService.persist).toBe(true);
        sessionStorageService.setUnpersist();
        expect(sessionStorageService.persist).toBe(false);
    });

    test('persist getter returns the correct _persist value', () => {
        expect(sessionStorageService.persist).toBe(true);
        sessionStorageService.setUnpersist();
        expect(sessionStorageService.persist).toBe(false);
        sessionStorageService.setPersist();
        expect(sessionStorageService.persist).toBe(true);
    });

    test('isAuthenticated getter returns correct value', async () => {
        await sessionStorageService.save(defaultAuthDatas);
        expect(sessionStorageService.isAuthenticated).toBe(true);

        await sessionStorageService.remove();
        expect(sessionStorageService.isAuthenticated).toBe(false);
    });

    test('token getter returns the correct token', async () => {
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepositoryMock, true);

        expect(sessionStorageService.token).toBeNull();

        await sessionStorageService.save(defaultAuthDatas);
        expect(sessionStorageService.token).toBe(defaultAuthDatas.token);
    });

    test('authDatas getter returns the correct authDatas', async () => {
        sessionStorageService = SessionStorageService.getInstance(storeAuthDatasRepositoryMock, true);

        expect(sessionStorageService.authDatas).toBeNull();

        await sessionStorageService.save(defaultAuthDatas);
        expect(sessionStorageService.authDatas).toBe(defaultAuthDatas);
    });

    test('save method should saves the authDatas if persist', async () => {
        await sessionStorageService.save(defaultAuthDatas);
        expect(storeAuthDatasRepositoryMock.save).toHaveBeenCalledTimes(1);
        expect(storeAuthDatasRepositoryMock.save).toHaveBeenCalledWith(defaultAuthDatas);
        expect(sessionStorageService.authDatas).toBe(defaultAuthDatas);
    });

    test('save method should not saves the authDatas if not persist', async () => {
        sessionStorageService.setUnpersist();
        await sessionStorageService.save(defaultAuthDatas);
        expect(storeAuthDatasRepositoryMock.save).toHaveBeenCalledTimes(0);
        expect(sessionStorageService.authDatas).toBe(defaultAuthDatas);
    });

    test('save method should retain without persist authDatas if storeAuthDatasRepository.save throws error', async () => {
        storeAuthDatasRepositoryMock.save.mockRejectedValue("error occured");
        sessionStorageService.setPersist();
        await sessionStorageService.save(defaultAuthDatas);
        expect(sessionStorageService.authDatas).toBe(defaultAuthDatas);
    });

    test('remove method should remove authDatas', async () => {
        sessionStorageService.setPersist();
        await sessionStorageService.save(defaultAuthDatas);
        await sessionStorageService.remove();
        expect(storeAuthDatasRepositoryMock.remove).toHaveBeenCalledTimes(1);
        expect(sessionStorageService.authDatas).toBeNull();
    });

    test('remove method should not remove authDatas if not persist', async () => {
        sessionStorageService.setUnpersist()
        await sessionStorageService.save(defaultAuthDatas);
        await sessionStorageService.remove();
        expect(storeAuthDatasRepositoryMock.remove).toHaveBeenCalledTimes(0);
        expect(sessionStorageService.authDatas).toBeNull();
    });

    test('remove method should remove authDatas even if storeAuthDatasRepository.remove throws error', async () => {
        storeAuthDatasRepositoryMock.remove.mockRejectedValue("error occured");
        await sessionStorageService.save(defaultAuthDatas);
        await sessionStorageService.remove();
        expect(sessionStorageService.authDatas).toBeNull();
    });
});