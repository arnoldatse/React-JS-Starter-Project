import StorageAdapter from "core/storage/StorageAdapter";
import StorageKeys from "core/storage/StorageKeys";

export default class LocalStorageAdapter implements StorageAdapter {
    getItem(key: StorageKeys) {
        return localStorage.getItem(key);
    }
    setItem(key: StorageKeys, value: string): void {
        localStorage.setItem(key, value);
    }
    removeItem(key: StorageKeys): void {
        localStorage.removeItem(key);
    }
    clear(): void {
        Object.keys(StorageKeys).forEach((key) => {
            this.removeItem(key as StorageKeys);
        });
    }
}