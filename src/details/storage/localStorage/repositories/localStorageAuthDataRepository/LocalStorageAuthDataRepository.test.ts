import LocalStorageAuthDataRepository from './LocalStorageAuthDataRepository';
import LocalStorageAdapter from '../../LocalStorage';
import AuthData from 'core/authUser/auth/entities/AuthData';
import StorageKeys from 'core/storage/StorageKeys';
import Roles from 'core/authUser/auth/entities/Role';

describe('LocalStorageAuthDataRepository', () => {
    let localStorageAuthDataRepository: LocalStorageAuthDataRepository;

    const authData: AuthData = {
        id: 1,
        username: 'Jhon Doe',
        email: 'jhonDoe@test.com',
        token: 'testToken',
        role: Roles.ADMIN
    };

    beforeEach(() => {
        localStorageAuthDataRepository = new LocalStorageAuthDataRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('save', () => {
        it('should successfully save auth data', async () => {
            const setItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { });

            await expect(localStorageAuthDataRepository.save(authData)).resolves.toBeUndefined();
            expect(setItemMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER, JSON.stringify(authData));
        });

        it('should throw an error if save fails', async () => {
            const error = new Error('Save failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { throw error; });

            await expect(localStorageAuthDataRepository.save(authData)).rejects.toThrow(error);
        });
    });

    describe('get', () => {
        it('should successfully get auth data', async () => {
            const getItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(JSON.stringify(authData));

            await expect(localStorageAuthDataRepository.get()).resolves.toEqual(authData);
            expect(getItemMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER);
        });

        it('should throw an error if no auth data is found', async () => {
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(null);

            await expect(localStorageAuthDataRepository.get()).rejects.toThrow('No authData found');
        });

        it('should throw an error if get fails', async () => {
            const error = new Error('Get failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockImplementation(() => { throw error; });

            await expect(localStorageAuthDataRepository.get()).rejects.toThrow(error);
        });
    });

    describe('remove', () => {
        it('should successfully remove auth data', async () => {
            const localStorageAdapterMock = jest.spyOn(LocalStorageAdapter.prototype, 'removeItem').mockImplementation(() => { });

            await expect(localStorageAuthDataRepository.remove()).resolves.toBeUndefined();
            expect(localStorageAdapterMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER);
        });

        it('should throw an error if remove fails', async () => {
            const error = new Error('Remove failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'removeItem').mockImplementation(() => { throw error; })

            await expect(localStorageAuthDataRepository.remove()).rejects.toThrow(error);
        });
    });
});