import StorageKeys from "./StorageKeys";

export default interface StorageAdapter {
    /**
     * get item from storage
     * @param key 
     * @returns 
     */
    getItem(key: StorageKeys): string | null;
    /**
     * set item to storage
     * @param key 
     * @param value 
     */
    setItem(key: StorageKeys, value: string): void;
    /**
     * remove item from storage
     * @param key 
     */
    removeItem(key: StorageKeys): void;
    /**
     * clear storage
     */
    clear(): void;
}