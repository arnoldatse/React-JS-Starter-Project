import Permission from "core/authUser/auth/entities/Permission";
import getRolePermissions from "core/authUser/auth/services/getRolePermissions/getRolePermissions";
import useAuthContext from "./useAuthContext";

const usePermission = () => {
    const { authDatas } = useAuthContext();

    return {
        can: (permission: Permission) => authDatas
            ? getRolePermissions(authDatas.role).includes(permission)
            : false,
    }
}

export default usePermission;