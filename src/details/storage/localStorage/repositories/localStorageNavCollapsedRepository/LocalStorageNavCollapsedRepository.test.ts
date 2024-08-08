import LocalStorageNavCollapsedRepository from './LocalStorageNavCollapsedRepository';
import LocalStorageAdapter from '../../LocalStorageAdapter';
import StorageKeys from 'core/storage/StorageKeys';

describe('LocalStorageNavCollapsedRepository', () => {
    let localStorageNavCollapsedRepository: LocalStorageNavCollapsedRepository;

    const navCollapsed = true;

    beforeEach(() => {
        localStorageNavCollapsedRepository = new LocalStorageNavCollapsedRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getCurrentNavCollapsed', () => {
        it('should successfully get the current nav collapsed state', async () => {
            const getItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(JSON.stringify(navCollapsed));

            await expect(localStorageNavCollapsedRepository.getCurrentNavCollapsed()).resolves.toEqual(navCollapsed);
            expect(getItemMock).toHaveBeenCalledWith(StorageKeys.NAV_COLLAPSED);
        });

        it('should throw an error if no nav collapsed state is found', async () => {
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(null);

            await expect(localStorageNavCollapsedRepository.getCurrentNavCollapsed()).rejects.toThrow('No nav collapsed found');
        });

        it('should throw an error if get fails', async () => {
            const error = new Error('Get failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockImplementation(() => { throw error; });

            await expect(localStorageNavCollapsedRepository.getCurrentNavCollapsed()).rejects.toThrow(error);
        });
    });

    describe('setCurrentNavCollapsed', () => {
        it('should successfully set the current nav collapsed state', async () => {
            const setItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { });

            await expect(localStorageNavCollapsedRepository.setCurrentNavCollapsed(navCollapsed)).resolves.toBeUndefined();
            expect(setItemMock).toHaveBeenCalledWith(StorageKeys.NAV_COLLAPSED, JSON.stringify(navCollapsed));
        });

        it('should throw an error if set fails', async () => {
            const error = new Error('Set failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { throw error; });

            await expect(localStorageNavCollapsedRepository.setCurrentNavCollapsed(navCollapsed)).rejects.toThrow(error);
        });
    });
});