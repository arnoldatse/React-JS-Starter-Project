import MenuByRoleBuilderService from './MenuByRoleBuilderService';
import SessionStorageService from '../sessionStorageService/SessionStorageService';
import { MenuOption, MenuOptionsGroup, MenuSectionTitle, Menu } from 'core/dashboard/menu/menu';
import StoreAuthDataRepository from 'core/authUser/auth/repositories/StoreAuthDataRepository';
import AuthData from 'core/authUser/auth/entities/AuthData';
import Roles from 'core/authUser/auth/entities/Role';
import Permission from 'core/authUser/auth/entities/Permission';
import PublicNavigationLocation from 'core/navigation/PublicNavigationLocation';
import DashboardNavigationLocation from 'core/navigation/DashboardNavigationLocation';
import { StringsKey } from 'core/internationalization/strings';
import getRolePermissions from '../getRolePermissions/getRolePermissions';

jest.mock("core/authUser/auth/services/getRolePermissions/getRolePermissions");

const defaultAuthData: AuthData = { id: 1, username: "Jhon Doe", email: 'jhondoe@email.com', token: 'some-token', role: Roles.ADMIN };

const guestMenuSectionTitle: MenuSectionTitle = {
    sectionTitle: 'Guest',
}

const aboutMenuOption: MenuOption = {
    title: 'about' as StringsKey,
    location: 'about' as PublicNavigationLocation | DashboardNavigationLocation
}

const guestMenuOptionsGroup: MenuOptionsGroup = {
    title: 'articles' as StringsKey,
    children: [
        {
            title: 'articles' as StringsKey,
            location: 'articles' as PublicNavigationLocation | DashboardNavigationLocation
        },
        {
            title: 'manage articles' as StringsKey,
            location: 'manage-articles' as PublicNavigationLocation | DashboardNavigationLocation,
            permission: Permission.READ
        }
    ]
}

const guestMenuOptionsGroupWithoutReadPermission: MenuOptionsGroup = {
    title: 'articles' as StringsKey,
    children: [
        {
            title: 'articles' as StringsKey,
            location: 'articles' as PublicNavigationLocation | DashboardNavigationLocation
        },
    ]
}

const homeMenuOption: MenuOption = {
    title: 'Home' as StringsKey,
    permission: Permission.WRITE,
    location: 'home' as PublicNavigationLocation | DashboardNavigationLocation
}

const userMenuSectionTitle: MenuSectionTitle = {
    sectionTitle: 'User',
    permission: 1001 as Permission
}

const userMenuOptionsGroup: MenuOptionsGroup = {
    title: 'User' as StringsKey,
    permission: 1002 as Permission,
    children: [
        {
            title: 'users' as StringsKey,
            permission: 1002 as Permission,
            location: 'users' as PublicNavigationLocation | DashboardNavigationLocation
        },
        {
            title: 'roles' as StringsKey,
            permission: 1003 as Permission,
            location: 'roles' as PublicNavigationLocation | DashboardNavigationLocation
        }
    ]
}

const fakeMenu: Menu = [
    guestMenuSectionTitle,
    aboutMenuOption,
    guestMenuOptionsGroup,
    homeMenuOption,
    userMenuSectionTitle,
    userMenuOptionsGroup
]

const responseMenuAlwaysReturned: Menu = [
    guestMenuSectionTitle,
    aboutMenuOption,
]



describe('MenuByRoleBuilderService', () => {
    let storeAuthDataRepositoryMock: jest.Mocked<StoreAuthDataRepository>;
    let sessionStorageService: SessionStorageService;

    beforeEach(() => {
        storeAuthDataRepositoryMock = {
            save: jest.fn(),
            get: jest.fn(),
            remove: jest.fn()
        };
        sessionStorageService = SessionStorageService.getInstance(storeAuthDataRepositoryMock);
    });

    it('should return only without permission menu options if user is not authenticated', () => {
        const menuByRoleBuilderService = new MenuByRoleBuilderService(sessionStorageService, fakeMenu);
        const menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            guestMenuOptionsGroupWithoutReadPermission]);
    })

    it('should return all menu options with role that has all Permission', async () => {
        //Mock Permission
        (getRolePermissions as jest.Mock).mockReturnValue([
            ...Object.values(Permission).filter(permission => typeof permission === 'number'),
            1001 as Permission,
            1002 as Permission,
            1003 as Permission
        ]);
        await sessionStorageService.save(defaultAuthData);
        const menuByRoleBuilderService = new MenuByRoleBuilderService(sessionStorageService, fakeMenu);
        const menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual(fakeMenu);
        expect(getRolePermissions).toHaveBeenCalled();
    });

    it('should return only menu options that matching the role Permission', async () => {
        //test role that has Permission [Permission.WRITE, Permission.1002, Permission.1003];
        (getRolePermissions as jest.Mock).mockReturnValue([
            Permission.WRITE,
            1002 as Permission,
            1003 as Permission
        ]);
        await sessionStorageService.save({ ...defaultAuthData, role: 1000 as Roles });
        let menuByRoleBuilderService = new MenuByRoleBuilderService(sessionStorageService, fakeMenu);
        let menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            guestMenuOptionsGroupWithoutReadPermission,
            homeMenuOption,
            userMenuOptionsGroup
        ]);

        //test role that has Permission [Permission.WRITE, Permission.1002];
        (getRolePermissions as jest.Mock).mockReturnValue([
            Permission.WRITE,
            1002 as Permission
        ]);
        await sessionStorageService.save({ ...defaultAuthData, role: 1001 as Roles });
        menuByRoleBuilderService = new MenuByRoleBuilderService(sessionStorageService, fakeMenu);
        menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            guestMenuOptionsGroupWithoutReadPermission,
            homeMenuOption,
            {
                title: 'User' as StringsKey,
                permission: 1002 as Permission,
                children: [
                    {
                        title: 'users',
                        permission: 1002,
                        location: 'users'
                    }
                ]
            }
        ]);

        //test role that has Permission [Permission.WRITE];
        (getRolePermissions as jest.Mock).mockReturnValue([
            Permission.WRITE
        ]);
        await sessionStorageService.save({ ...defaultAuthData, role: 1002 as Roles });
        menuByRoleBuilderService = new MenuByRoleBuilderService(sessionStorageService, fakeMenu);
        menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            guestMenuOptionsGroupWithoutReadPermission,
            homeMenuOption
        ]);

    });

});