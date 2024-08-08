import StorageKeys from 'core/storage/StorageKeys';
import LocalStorageAdapter from './LocalStorageAdapter';

describe('LocalStorageAdapter', () => {
    let localStorageAdapter: LocalStorageAdapter;
    let storageValues: Record<string, string>;
    beforeEach(() => {
        storageValues = {};
        global.localStorage = {
            setItem: jest.fn((key: string, value: string) => {
                storageValues[key] = value;
            }),
            getItem: jest.fn((key: string) => {
                return storageValues[key] || null;
            }),
            removeItem: jest.fn((key: string) => {
                delete storageValues[key];
            }),
            clear: jest.fn(() => {
                storageValues = {};
            }),
            key: jest.fn((index: number) => {
                return Object.keys(storageValues)[index] || null;
            }),
            length: Object.keys(storageValues).length,
        };

        localStorageAdapter = new LocalStorageAdapter();
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe('getItem', () => {
        it('should successfully get an item from localStorage', () => {
            const key = StorageKeys.AUTHENTICATED_USER;
            const value = 'testValue';
            localStorage.setItem(key, value);

            const result = localStorageAdapter.getItem(key);

            expect(localStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toBe(value);
        });

        it('should return null if the item does not exist', () => {
            const key = StorageKeys.AUTHENTICATED_USER;

            const result = localStorageAdapter.getItem(key);

            expect(localStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });
    });

    describe('setItem', () => {
        it('should successfully set an item in localStorage', () => {
            const key = StorageKeys.AUTHENTICATED_USER;
            const value = 'testValue';

            localStorageAdapter.setItem(key, value);

            expect(localStorage.setItem).toHaveBeenCalledWith(key, value);
            expect(localStorage.getItem(key)).toBe(value);
        });
    });

    describe('removeItem', () => {
        it('should successfully remove an item from localStorage', () => {
            const key = StorageKeys.AUTHENTICATED_USER;
            const value = 'testValue';
            localStorage.setItem(key, value);

            localStorageAdapter.removeItem(key);

            expect(localStorage.removeItem).toHaveBeenCalledWith(key);
            expect(localStorage.getItem(key)).toBeNull();
        });
    });

    describe('clear', () => {
        it('should successfully clear all items from localStorage', () => {
            const key1 = StorageKeys.AUTHENTICATED_USER;
            const value1 = 'testValue1';
            const key2 = StorageKeys.LANGUAGE;
            const value2 = 'testValue2';
            localStorage.setItem(key1, value1);
            localStorage.setItem(key2, value2);

            localStorageAdapter.clear();

            expect(localStorage.getItem(key1)).toBeNull();
            expect(localStorage.getItem(key2)).toBeNull();
        });
    });
});