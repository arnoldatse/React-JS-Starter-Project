import Roles from "core/authUser/auth/entities/Role";
import Permission from "core/authUser/auth/entities/Permission";

const getRolePermissions: (role: Roles) => Permission[] = (role: Roles) => {
    const permissions: Permission[] = [];

    switch (role) {
        case Roles.ADMIN:
            Object.values(Permission)
                .filter(permission => typeof permission === 'number')
                .forEach(permission => permissions.push(permission));
            return permissions;
        default:
            return [];
    }
}

export default getRolePermissions;