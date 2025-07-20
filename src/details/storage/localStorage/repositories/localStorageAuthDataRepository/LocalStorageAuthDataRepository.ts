import AuthData from "core/authUser/auth/entities/AuthData";
import LocalStorageAdapter from "../../LocalStorage";
import StorageKeys from "core/storage/StorageKeys";
import StoreAuthDataRepository from "core/authUser/auth/repositories/StoreAuthDataRepository";

export default class LocalStorageAuthDataRepository implements StoreAuthDataRepository {
    private readonly StorageAdapter = new LocalStorageAdapter();
    private readonly authDataKey = StorageKeys.AUTHENTICATED_USER;

    save(authData: AuthData): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.StorageAdapter.setItem(this.authDataKey, JSON.stringify(authData));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
    get(): Promise<AuthData> {
        return new Promise((resolve, reject) => {
            try {
                const authData = this.StorageAdapter.getItem(this.authDataKey);
                if (!authData) {
                    throw new Error("No authData found");
                }
                resolve(JSON.parse(authData));
            } catch (error) {
                reject(error);
            }
        });
    }
    remove(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.StorageAdapter.removeItem(this.authDataKey);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}