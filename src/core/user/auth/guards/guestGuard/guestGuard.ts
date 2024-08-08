import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";

const guestGuard = (sessionStorageService: SessionStorageService)=>{
    return !sessionStorageService.isAuthenticated;
}

export default guestGuard;