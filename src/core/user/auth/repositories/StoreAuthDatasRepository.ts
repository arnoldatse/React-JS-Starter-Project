import AuthDatas from "../entities/AuthDatas";

export default interface StoreAuthDatasRepository {
    save(authDatas: AuthDatas): Promise<void>;
    get(): Promise<AuthDatas>;
    remove(): Promise<void>;
}