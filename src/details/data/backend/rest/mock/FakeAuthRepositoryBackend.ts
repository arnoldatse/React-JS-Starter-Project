import Logger from "core/log/Logger";
import AuthData from "core/authUser/auth/entities/AuthData";
import Roles from "core/authUser/auth/entities/Role";
import AuthRepository from "core/authUser/auth/repositories/AuthRepository";
import DefaultExceptionType from "core/exceptions/DefaultExceptionType";
import { DefaultHttpExceptionType } from "http-repository-cache";

export default class FakeAuthRepositoryBackend implements AuthRepository {
    login(email: string, password: string): Promise<AuthData> {
        Logger.getInstance().log({ email, password }, 'FakeAuthRepositoryBackend.login');

        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === 'admin@test.com' && password === 'admin') {
                    resolve({
                        id: '1',
                        username: 'Test User',
                        email,
                        role: Roles.ADMIN,
                        token: 'test-token'
                    });
                }
                else if(password === 'exception'){
                    reject({ type: DefaultHttpExceptionType.SERVER_UNAVAILABLE });
                }
                else {
                    reject({ type: DefaultExceptionType.UNAUTHORIZED });
                }
            }, 3000);

        });


    }

    logout(token: string): Promise<void> {
        return Promise.resolve();
    };
}