import AuthRepositoryBackend from "details/datas/backend/rest/repositories/AuthRepositoryBackend/AuthRepositoryBackend";
import AuthRepository from "core/user/auth/repositories/AuthRepository";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import LogoutUsecase from "core/user/auth/usecases/LogoutUseCase/LogoutUseCase";
import httpRequestService from "app/services/httpRequestService";
import LocalStorageAuthDatasRepository from "details/storage/localStorage/repositories/localStorageAuthDatasRepository/LocalStorageAuthDatasRepository";

const useAuth = () => {
    const sessionStorageService = SessionStorageService.getInstance(new LocalStorageAuthDatasRepository());
    const authRepository: AuthRepository = new AuthRepositoryBackend(httpRequestService)
    const logoutUsecase = new LogoutUsecase(authRepository, sessionStorageService);

    return {
        updateAuthDatas: sessionStorageService.save,
        logout: logoutUsecase,
        sessionStorageService
    }
}

export default useAuth;