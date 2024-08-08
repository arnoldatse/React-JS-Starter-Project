import { MenuOptionsGroup, MenuType } from "core/dashboard/menu/menu";
import Permissions from "../../entities/Permissions";
import getRolePermissions from "../getRolePermissions/getRolePermissions";
import SessionStorageService from "../sessionStorageService/SessionStorageService";

class MenuByRoleBuilderService {

    constructor(private sessionStorageService: SessionStorageService, private readonly menu: MenuType) { }

    private isAuthorized(permission: Permissions): boolean {
        const role = this.sessionStorageService.authDatas?.role;
        if (role) {
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

    buildMenu(): MenuType {
        return this.menu
            .filter(menuOption => !menuOption.permission || this.isAuthorized(menuOption.permission))
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