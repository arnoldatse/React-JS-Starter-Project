import Permissions from "core/user/auth/entities/Permissions";
import getRolePermissions from "core/user/auth/services/getRolePermissions/getRolePermissions";
import useAuthContext from "./useAuthContext";

const usePermission = () => {
    const { authDatas } = useAuthContext();

    return {
        can: (permission: Permissions) => authDatas
            ? getRolePermissions(authDatas.role).includes(permission)
            : false,
    }
}

export default usePermission;