import LocalStorageAuthDatasRepository from './LocalStorageAuthDatasRepository';
import LocalStorageAdapter from '../../LocalStorageAdapter';
import AuthDatas from 'core/user/auth/entities/AuthDatas';
import StorageKeys from 'core/storage/StorageKeys';
import Roles from 'core/user/auth/entities/Roles';

describe('LocalStorageAuthDatasRepository', () => {
    let localStorageAuthDatasRepository: LocalStorageAuthDatasRepository;

    const authDatas: AuthDatas = {
        id: 1,
        username: 'Jhon Doe',
        token: 'testToken',
        role: Roles.Admin
    };

    beforeEach(() => {
        localStorageAuthDatasRepository = new LocalStorageAuthDatasRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('save', () => {
        it('should successfully save auth data', async () => {
            const setItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { });

            await expect(localStorageAuthDatasRepository.save(authDatas)).resolves.toBeUndefined();
            expect(setItemMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER, JSON.stringify(authDatas));
        });

        it('should throw an error if save fails', async () => {
            const error = new Error('Save failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { throw error; });

            await expect(localStorageAuthDatasRepository.save(authDatas)).rejects.toThrow(error);
        });
    });

    describe('get', () => {
        it('should successfully get auth data', async () => {
            const getItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(JSON.stringify(authDatas));

            await expect(localStorageAuthDatasRepository.get()).resolves.toEqual(authDatas);
            expect(getItemMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER);
        });

        it('should throw an error if no auth data is found', async () => {
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(null);

            await expect(localStorageAuthDatasRepository.get()).rejects.toThrow('No authDatas found');
        });

        it('should throw an error if get fails', async () => {
            const error = new Error('Get failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockImplementation(() => { throw error; });

            await expect(localStorageAuthDatasRepository.get()).rejects.toThrow(error);
        });
    });

    describe('remove', () => {
        it('should successfully remove auth data', async () => {
            const localStorageAdapterMock = jest.spyOn(LocalStorageAdapter.prototype, 'removeItem').mockImplementation(() => { });

            await expect(localStorageAuthDatasRepository.remove()).resolves.toBeUndefined();
            expect(localStorageAdapterMock).toHaveBeenCalledWith(StorageKeys.AUTHENTICATED_USER);
        });

        it('should throw an error if remove fails', async () => {
            const error = new Error('Remove failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'removeItem').mockImplementation(() => { throw error; })

            await expect(localStorageAuthDatasRepository.remove()).rejects.toThrow(error);
        });
    });
});