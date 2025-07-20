import SessionStorageService from "core/authUser/auth/services/sessionStorageService/SessionStorageService";
import LogoutUseCase from "core/authUser/auth/useCases/LogoutUseCase/LogoutUseCase";

const useAuth = () => {
    const sessionStorageService = SessionStorageService.getInstance();
    const logoutUseCase = new LogoutUseCase();

    return {
        updateAuthData: sessionStorageService.save,
        logoutUseCase,
        sessionStorageService
    }
}

export default useAuth;
