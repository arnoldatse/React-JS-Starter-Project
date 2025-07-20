import AuthData from "../entities/AuthData";

export default interface AuthRepository {
    login: (email: string, password: string) => Promise<AuthData>;
    logout: (token: string) => Promise<void>;
}