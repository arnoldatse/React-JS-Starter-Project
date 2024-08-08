import Permissions from "../../entities/Permissions";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import getRolePermissions from "../../services/getRolePermissions/getRolePermissions";

const permissionGuard = (sessionStorageService: SessionStorageService, requiredPermission: Permissions) => {
    const role = sessionStorageService.authDatas?.role;
    return role ? getRolePermissions(sessionStorageService.authDatas?.role).includes(requiredPermission) : false;
}

export default permissionGuard;