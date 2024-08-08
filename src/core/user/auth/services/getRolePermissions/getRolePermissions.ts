import Roles from "core/user/auth/entities/Roles";
import Permissions from "core/user/auth/entities/Permissions";

const getRolePermissions: (role: Roles) => Permissions[] = (role: Roles) => {
    const permissions: Permissions[] = [];

    switch (role) {
        case Roles.Admin:
            for (const permission in Permissions) {
                permissions.push(permission as Permissions);
            }
            return permissions;
        case Roles.SubAdmin:
            return [Permissions.DASHBOARD, Permissions.ACCOUNT_READ, Permissions.ACCOUNT_WRITE];
        case Roles.UserManager:
            return [Permissions.ACCOUNT_WRITE, Permissions.ACCOUNT_READ];
        case Roles.Supervisor:
            return [Permissions.ACCOUNT_READ];
        default:
            return [];
    }
}

export default getRolePermissions;