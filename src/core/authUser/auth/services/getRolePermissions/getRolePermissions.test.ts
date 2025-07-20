import getRolePermissions from "./getRolePermissions";
import Roles from "core/authUser/auth/entities/Role";
import Permission from "core/authUser/auth/entities/Permission";

describe('getRolePermissions', () => {
    it('returns correct Permission for a valid role', () => {
        const role: Roles = Roles.ADMIN;
        const expectedPermissions: Permission[] = [Permission.WRITE, Permission.READ];
        expect(getRolePermissions(role)).toEqual(expectedPermissions);
    });

    it('handles invalid role input gracefully', () => {
        const invalidRole: Roles = 1000 as Roles;
        const expectedOutput: Permission[] = []; // Assuming the function returns an empty array for invalid roles
        expect(getRolePermissions(invalidRole)).toEqual(expectedOutput);
    });
});