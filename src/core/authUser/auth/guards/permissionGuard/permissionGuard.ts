import Permission from "../../entities/Permission";
import SessionStorageService from "../../services/sessionStorageService/SessionStorageService";
import getRolePermissions from "../../services/getRolePermissions/getRolePermissions";

const permissionGuard = (sessionStorageService: SessionStorageService, requiredPermission: Permission) => {
    const role = sessionStorageService.authData?.role;
    return (typeof role === 'number') ? getRolePermissions(role).includes(requiredPermission) : false;
}

export default permissionGuard;