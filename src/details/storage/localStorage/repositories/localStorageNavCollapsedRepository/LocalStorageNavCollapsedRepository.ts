import NavCollapsedRepository from "core/theme/NavCollapsedRepository";
import LocalStorageAdapter from "../../LocalStorageAdapter";
import StorageKeys from "core/storage/StorageKeys";

export default class LocalStorageNavCollapsedRepository implements NavCollapsedRepository{
    private storageAdapter = new LocalStorageAdapter();

    getCurrentNavCollapsed(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                const themeMode = this.storageAdapter.getItem(StorageKeys.NAV_COLLAPSED);
                if (!themeMode) {
                    throw new Error("No nav collapsed found");
                }
                resolve(JSON.parse(themeMode));
            } catch (error) {
                reject(error);
            }
        });
    }
    setCurrentNavCollapsed(navCollapsed: boolean): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.storageAdapter.setItem(StorageKeys.NAV_COLLAPSED, JSON.stringify(navCollapsed));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}