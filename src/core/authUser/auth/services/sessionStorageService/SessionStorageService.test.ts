import StoreAuthDataRepository from 'core/authUser/auth/repositories/StoreAuthDataRepository';
import Roles from 'core/authUser/auth/entities/Role';
import Logger from 'core/log/Logger';
import Exception from 'core/exceptions/Exception';
import AuthData from '../../entities/AuthData';
import SessionStorageExceptionTypes from '../../exceptions/SessionStorageExceptionType';
import SessionStorageService from './SessionStorageService';


const defaultAuthData: AuthData = { id: '1', username: "Jhon Doe", email: 'jhonDoe@email.com', token: "some-token", role: Roles.ADMIN };


describe('SessionStorageService', () => {
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

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInstance', () => {
        test('getInstance returns a singleton instance', () => {
            const instance1 = SessionStorageService.getInstance();
            const instance2 = SessionStorageService.getInstance();
            expect(instance1).toBe(instance2);
        });

        test('getInstance creates a new instance if gave StoreAuthDataRepository in parameter of getInstance', () => {
            const instance1 = SessionStorageService.getInstance();
            const instance2 = SessionStorageService.getInstance(storeAuthDataRepositoryMock);
            const instance3 = SessionStorageService.getInstance();
            expect(instance1).not.toBe(instance2);
            expect(instance2).toBe(instance3);
        });
    });

    describe('persistence', () => {
        test('enablePersist and enablePersist correctly set _persist', () => {
            sessionStorageService.enablePersist();
            expect(sessionStorageService.persist).toBe(true);
            sessionStorageService.disablePersist();
            expect(sessionStorageService.persist).toBe(false);
        });

        test('persist getter returns the correct _persist value', () => {
            expect(sessionStorageService.persist).toBe(true);
            sessionStorageService.disablePersist();
            expect(sessionStorageService.persist).toBe(false);
            sessionStorageService.enablePersist();
            expect(sessionStorageService.persist).toBe(true);
        });
    })

    test('isAuthenticated getter returns correct value', async () => {
        await sessionStorageService.save(defaultAuthData);
        expect(sessionStorageService.isAuthenticated).toBe(true);

        await sessionStorageService.remove();
        expect(sessionStorageService.isAuthenticated).toBe(false);
    });

    test('token getter returns the correct token', async () => {
        expect(sessionStorageService.token).toBeNull();

        await sessionStorageService.save(defaultAuthData);
        expect(sessionStorageService.token).toBe(defaultAuthData.token);
    });

    test('authData getter returns the correct authData', async () => {
        expect(sessionStorageService.authData).toBeNull();

        await sessionStorageService.save(defaultAuthData);
        expect(sessionStorageService.authData).toBe(defaultAuthData);
    });

    describe('save', () => {
        test('save method should saves the authData if persist', async () => {
            await sessionStorageService.save(defaultAuthData);
            expect(storeAuthDataRepositoryMock.save).toHaveBeenCalledTimes(1);
            expect(storeAuthDataRepositoryMock.save).toHaveBeenCalledWith(defaultAuthData);
            expect(sessionStorageService.authData).toBe(defaultAuthData);
        });

        test('save method should not saves the authData if not persist', async () => {
            sessionStorageService.disablePersist();
            await sessionStorageService.save(defaultAuthData);
            expect(storeAuthDataRepositoryMock.save).toHaveBeenCalledTimes(0);
            expect(sessionStorageService.authData).toBe(defaultAuthData);
        });

        test('save method should retain without persist authData if StoreAuthDataRepository.save throws exception', async () => {
            const saveError = new Error("error occurred");
            storeAuthDataRepositoryMock.save.mockRejectedValue(saveError);
            sessionStorageService.enablePersist();
            try {
                await sessionStorageService.save(defaultAuthData);
            } catch (exception: unknown) {
                expect(exception).toEqual({
                    type: SessionStorageExceptionTypes.FAILED_TO_SAVE_AUTH_DATA,
                    body: saveError,
                });
            }
            expect(sessionStorageService.authData).toBe(defaultAuthData);
        });

        test('save method should Log error if StoreAuthDataRepository.save throws exception', async () => {
            const saveError = new Error("error occurred");
            storeAuthDataRepositoryMock.save.mockRejectedValue(saveError);
            sessionStorageService.enablePersist();

            const LoggerLogSpy = jest.spyOn(Logger.prototype, 'log');

            const saveException: Exception<unknown, SessionStorageExceptionTypes> = {
                type: SessionStorageExceptionTypes.FAILED_TO_SAVE_AUTH_DATA,
                body: saveError,
            }

            try {
                await sessionStorageService.save(defaultAuthData);
            } catch (exception: unknown) {
                expect(exception).toEqual(saveException);
            }
            expect(LoggerLogSpy).toHaveBeenCalledTimes(1);
            expect(LoggerLogSpy).toHaveBeenCalledWith(saveException, "SessionStorageService.save");
        });
    });

    describe('remove', () => {
        test('remove method should remove authData', async () => {
            sessionStorageService.enablePersist();
            await sessionStorageService.save(defaultAuthData);
            await sessionStorageService.remove();
            expect(storeAuthDataRepositoryMock.remove).toHaveBeenCalledTimes(1);
            expect(sessionStorageService.authData).toBeNull();
        });

        test('remove method should not remove authData if not persist', async () => {
            sessionStorageService.disablePersist()
            await sessionStorageService.save(defaultAuthData);
            await sessionStorageService.remove();
            expect(storeAuthDataRepositoryMock.remove).toHaveBeenCalledTimes(0);
            expect(sessionStorageService.authData).toBeNull();
        });

        test('remove method should remove authData even if StoreAuthDataRepository.remove throws exception', async () => {
            const saveError = new Error("error occurred");
            storeAuthDataRepositoryMock.remove.mockRejectedValue(saveError);
            await sessionStorageService.save(defaultAuthData);
            try {
                await sessionStorageService.remove();
            }
            catch (exception: unknown) {
                expect(exception).toEqual({
                    type: SessionStorageExceptionTypes.FAILED_TO_REMOVE_AUTH_DATA,
                    body: saveError,
                });
            }
            expect(sessionStorageService.authData).toBeNull();
        });

        test('remove method should Log error if StoreAuthDataRepository.remove throws exception', async () => {
            const saveError = new Error("error occurred");
            storeAuthDataRepositoryMock.remove.mockRejectedValue(saveError);

            const LoggerLogSpy = jest.spyOn(Logger.prototype, 'log');

            const removeException: Exception<unknown, SessionStorageExceptionTypes> = {
                type: SessionStorageExceptionTypes.FAILED_TO_REMOVE_AUTH_DATA,
                body: saveError,
            }

            await sessionStorageService.save(defaultAuthData);
            try {
                await sessionStorageService.remove();
            }
            catch (exception: unknown) {
                expect(exception).toEqual(removeException);
            }
            expect(LoggerLogSpy).toHaveBeenCalledTimes(1);
            expect(LoggerLogSpy).toHaveBeenCalledWith(removeException, "SessionStorageService.save");
        });
    });
});