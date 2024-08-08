import LocalStorageThemeModeRepository from './LocalStorageThemeModeRepository';
import LocalStorageAdapter from '../../LocalStorageAdapter';
import StorageKeys from 'core/storage/StorageKeys';

describe('LocalStorageThemeModeRepository', () => {
    let localStorageThemeModeRepository: LocalStorageThemeModeRepository<'light'|'dark'>;

    const themeMode = 'dark';

    beforeEach(() => {
        localStorageThemeModeRepository = new LocalStorageThemeModeRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getCurrentThemeMode', () => {
        it('should successfully get the current theme mode', async () => {
            const getItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(JSON.stringify(themeMode));

            await expect(localStorageThemeModeRepository.getCurrentThemeMode()).resolves.toEqual(themeMode);
            expect(getItemMock).toHaveBeenCalledWith(StorageKeys.THEME_MODE);
        });

        it('should throw an error if no theme mode is found', async () => {
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(null);

            await expect(localStorageThemeModeRepository.getCurrentThemeMode()).rejects.toThrow('No theme mode found');
        });

        it('should throw an error if get fails', async () => {
            const error = new Error('Get failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockImplementation(() => { throw error; });

            await expect(localStorageThemeModeRepository.getCurrentThemeMode()).rejects.toThrow(error);
        });
    });

    describe('setCurrentThemeMode', () => {
        it('should successfully set the current theme mode', async () => {
            const setItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { });

            await expect(localStorageThemeModeRepository.setCurrentThemeMode(themeMode)).resolves.toBeUndefined();
            expect(setItemMock).toHaveBeenCalledWith(StorageKeys.THEME_MODE, JSON.stringify(themeMode));
        });

        it('should throw an error if set fails', async () => {
            const error = new Error('Set failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { throw error; });

            await expect(localStorageThemeModeRepository.setCurrentThemeMode(themeMode)).rejects.toThrow(error);
        });
    });
});