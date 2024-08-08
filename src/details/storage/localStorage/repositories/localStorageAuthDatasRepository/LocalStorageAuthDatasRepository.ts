import AuthDatas from "core/user/auth/entities/AuthDatas";
import LocalStorageAdapter from "../../LocalStorageAdapter";
import StorageKeys from "core/storage/StorageKeys";
import StoreAuthDatasRepository from "core/user/auth/repositories/StoreAuthDatasRepository";

export default class LocalStorageAuthDatasRepository implements StoreAuthDatasRepository {
    private StorageAdapter = new LocalStorageAdapter();
    private authDatasKey = StorageKeys.AUTHENTICATED_USER;

    save(authDatas: AuthDatas): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.StorageAdapter.setItem(this.authDatasKey, JSON.stringify(authDatas));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    get(): Promise<AuthDatas> {
        return new Promise((resolve, reject) => {
            try {
                const authDatas = this.StorageAdapter.getItem(this.authDatasKey);
                if (!authDatas) {
                    throw new Error("No authDatas found");
                }
                resolve(JSON.parse(authDatas));
            } catch (error) {
                reject(error);
            }
        });
    }
    remove(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.StorageAdapter.removeItem(this.authDatasKey);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}