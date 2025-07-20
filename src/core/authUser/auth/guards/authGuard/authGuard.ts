import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";

const authGuard = (sessionStorageService: SessionStorageService) => {
  return sessionStorageService.isAuthenticated;
};

export default authGuard;
