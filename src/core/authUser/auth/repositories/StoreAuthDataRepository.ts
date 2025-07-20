import AuthData from "../entities/AuthData";

export default interface StoreAuthDataRepository {
    save(authData: AuthData): Promise<void>;
    get(): Promise<AuthData>;
    remove(): Promise<void>;
}