import AuthDatas from "../entities/AuthDatas";

export default interface AuthRepository {
    login: (email: string, password: string) => Promise<AuthDatas>;
    logout: (token: string) => Promise<void>;
}