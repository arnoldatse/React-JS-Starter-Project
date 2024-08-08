import getRolePermissions from "./getRolePermissions";
import Roles from "core/user/auth/entities/Roles";
import Permissions from "core/user/auth/entities/Permissions";

describe('getRolePermissions', () => {
    it('returns correct permissions for a valid role', () => {
        const role: Roles = Roles.Admin;
        const expectedPermissions: Permissions[] = [Permissions.DASHBOARD, Permissions.ACCOUNT_WRITE, Permissions.ACCOUNT_READ, Permissions.ADMINISTRATION];
        expect(getRolePermissions(role)).toEqual(expectedPermissions);
    });

    it('handles invalid role input gracefully', () => {
        const invalidRole = 'invalidRole';
        const expectedOutput: Permissions[] = []; // Assuming the function returns an empty array for invalid roles
        expect(getRolePermissions(invalidRole as Roles)).toEqual(expectedOutput);
    });
});