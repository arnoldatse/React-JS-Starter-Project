import { MenuOptionsGroup, Menu } from "core/dashboard/menu/menu";
import Permission from "../../entities/Permission";
import getRolePermissions from "../getRolePermissions/getRolePermissions";
import SessionStorageService from "../sessionStorageService/SessionStorageService";

class MenuByRoleBuilderService {

    constructor(private readonly sessionStorageService: SessionStorageService, private readonly menu: Menu) { }

    private isAuthorized(permission: Permission): boolean {
        const role = this.sessionStorageService.authData?.role;
        if (typeof role === 'number') {
            return getRolePermissions(role).includes(permission);
        }
        return false;
    }

    private buildMenuOptionsGroup(menuOptionsGroup: MenuOptionsGroup): MenuOptionsGroup {
        menuOptionsGroup.children = menuOptionsGroup.children
            .filter(menuOption => !menuOption.permission || this.isAuthorized(menuOption.permission))
            .map(menuOption => {
                if ((menuOption as MenuOptionsGroup).children) {
                    return this.buildMenuOptionsGroup(menuOption as MenuOptionsGroup);
                }

                return menuOption;
            });

        return menuOptionsGroup;
    }

    buildMenu(): Menu {
        return this.menu
            .filter(menuOption => typeof menuOption.permission !== 'number' || this.isAuthorized(menuOption.permission))
            .map(menuOption => {
                if ((menuOption as MenuOptionsGroup).children) {
                    return this.buildMenuOptionsGroup(menuOption as MenuOptionsGroup);
                }

                return menuOption;
            }).filter(menuOption => {
                if ((menuOption as MenuOptionsGroup).children) {
                    return (menuOption as MenuOptionsGroup).children.length > 0;
                }
                return true;
            });
    }
}

export default MenuByRoleBuilderService;