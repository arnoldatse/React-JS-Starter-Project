import ThemeModeRepository from "core/theme/ThemeModeRepository";
import LocalStorageAdapter from "../../LocalStorageAdapter";
import StorageKeys from "core/storage/StorageKeys";

export default class LocalStorageThemeModeRepository<T> implements ThemeModeRepository<T>{
    private storageAdapter = new LocalStorageAdapter();

    getCurrentThemeMode(): Promise<T> {
        return new Promise((resolve, reject) => {
            try {
                const themeMode = this.storageAdapter.getItem(StorageKeys.THEME_MODE);
                if (!themeMode) {
                    throw new Error("No theme mode found");
                }
                resolve(JSON.parse(themeMode));
            } catch (error) {
                reject(error);
            }
        });
    }
    setCurrentThemeMode(themeMode: T): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.storageAdapter.setItem(StorageKeys.THEME_MODE, JSON.stringify(themeMode));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}