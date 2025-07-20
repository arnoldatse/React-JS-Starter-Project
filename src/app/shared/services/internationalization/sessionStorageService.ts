import SessionStorageService from "core/authUser/auth/services/sessionStorageService/SessionStorageService";
import storeAuthDataRepository from "app/shared/repositories/storeAuthDataRepository";

const sessionStorageService = SessionStorageService.getInstance(
    storeAuthDataRepository
);

export default sessionStorageService;
