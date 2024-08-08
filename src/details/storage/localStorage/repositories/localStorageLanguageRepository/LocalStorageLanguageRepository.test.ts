import LocalStorageLanguageRepository from './LocalStorageLanguageRepository';
import LocalStorageAdapter from '../../LocalStorageAdapter';
import { languages } from 'core/internationalization/languages';
import StorageKeys from 'core/storage/StorageKeys';

describe('LocalStorageLanguageRepository', () => {
    let localStorageLanguageRepository: LocalStorageLanguageRepository;

    const language = languages.fr;

    beforeEach(() => {
        localStorageLanguageRepository = new LocalStorageLanguageRepository();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getCurrentLanguage', () => {
        it('should successfully get the current language', async () => {
            const getItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(JSON.stringify(language));

            await expect(localStorageLanguageRepository.getCurrentLanguage()).resolves.toEqual(language);
            expect(getItemMock).toHaveBeenCalledWith(StorageKeys.LANGUAGE);
        });

        it('should throw an error if no language is found', async () => {
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockReturnValue(null);

            await expect(localStorageLanguageRepository.getCurrentLanguage()).rejects.toThrow('No language found');
        });

        it('should throw an error if get fails', async () => {
            const error = new Error('Get failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'getItem').mockImplementation(() => { throw error; });

            await expect(localStorageLanguageRepository.getCurrentLanguage()).rejects.toThrow(error);
        });
    });

    describe('setCurrentLanguage', () => {
        it('should successfully set the current language', async () => {
            const setItemMock = jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { });

            await expect(localStorageLanguageRepository.setCurrentLanguage(language)).resolves.toBeUndefined();
            expect(setItemMock).toHaveBeenCalledWith(StorageKeys.LANGUAGE, JSON.stringify(language));
        });

        it('should throw an error if set fails', async () => {
            const error = new Error('Set failed');
            jest.spyOn(LocalStorageAdapter.prototype, 'setItem').mockImplementation(() => { throw error; });

            await expect(localStorageLanguageRepository.setCurrentLanguage(language)).rejects.toThrow(error);
        });
    });
});