import MenuByRoleBuilderService from './MenuByRoleBuilderService';
import SessionStorageService from '../sessionStorageService/SessionStorageService';
import { MenuOption, MenuOptionsGroup, MenuSectionTitle, MenuType } from 'core/dashboard/menu/menu';
import StoreAuthDatasRepository from 'core/user/auth/repositories/StoreAuthDatasRepository';
import AuthDatas from 'core/user/auth/entities/AuthDatas';
import Roles from 'core/user/auth/entities/Roles';
import Permissions from 'core/user/auth/entities/Permissions';

class MockStoreAuthDatasRepository implements StoreAuthDatasRepository {
    private _autDatas: AuthDatas | null = null;

    async save(authDatas: AuthDatas): Promise<void> {
        this._autDatas = authDatas;
    }
    get(): Promise<AuthDatas> {
        return new Promise((resolve, reject) => { this._autDatas ? resolve(this._autDatas) : reject('Not found') });
    }
    async remove(): Promise<void> {
        this._autDatas = null;
    }

}

const defaultAuthDatas: AuthDatas = { id: 1, username: "Jhon Doe", token: 'some-token', role: Roles.Admin };

const guestMenuSectionTitle: MenuSectionTitle = {
    sectionTitle: 'Guest',
}

const aboutMenuOption: MenuOption = {
    title: 'about',
}

const guestMenuOptionsGroup: MenuOptionsGroup = {
    title: 'articles',
    children: [
        {
            title: 'articles',
        },
        {
            title: 'manage articles',
            permission: Permissions.ADMINISTRATION
        }
    ]
}

const homeMenuOption: MenuOption = {
    title: 'Home',
    permission: Permissions.DASHBOARD
}

const userMenuSectionTitle: MenuSectionTitle = {
    sectionTitle: 'User',
    permission: Permissions.ACCOUNT_READ
}

const userMenuOptionsGroup: MenuOptionsGroup = {
    title: 'User',
    permission: Permissions.ACCOUNT_READ,
    children: [
        {
            title: 'users',
            permission: Permissions.ACCOUNT_READ
        },
        {
            title: 'roles',
            permission: Permissions.ACCOUNT_WRITE
        }
    ]
}

const fakeMenu: MenuType = [
    guestMenuSectionTitle,
    aboutMenuOption,
    guestMenuOptionsGroup,
    homeMenuOption,
    userMenuSectionTitle,
    userMenuOptionsGroup
]

const responseMenuAlwaysReturned: MenuType = [
    guestMenuSectionTitle,
    aboutMenuOption,
]

describe('MenuByRoleBuilderService', () => {
    let mockSessionStorageService: SessionStorageService;

    beforeEach(() => {
        mockSessionStorageService = SessionStorageService.getInstance(new MockStoreAuthDatasRepository(), true);
    });

    it('should return only without permission menu options if user is not authenticated', () => {
        const menuByRoleBuilderService = new MenuByRoleBuilderService(mockSessionStorageService, fakeMenu);
        const menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            {
                title: 'articles',
                children: [
                    {
                        title: 'articles',
                    }
                ]
            }]);
    })

    it('should return all menu options with role that has all permissions', async () => {
        await mockSessionStorageService.save(defaultAuthDatas);
        const menuByRoleBuilderService = new MenuByRoleBuilderService(mockSessionStorageService, fakeMenu);
        const menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual(fakeMenu);
    });

    it('should return only menu options that matching the role permissions', async () => {
        //test role that has permissions [Permissions.DASHBOARD, Permissions.ACCOUNT_READ, Permissions.ACCOUNT_WRITE];
        await mockSessionStorageService.save({ ...defaultAuthDatas, role: Roles.SubAdmin });
        let menuByRoleBuilderService = new MenuByRoleBuilderService(mockSessionStorageService, fakeMenu);
        let menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            {
                title: 'articles',
                children: [
                    {
                        title: 'articles',
                    }
                ]
            },
            homeMenuOption,
            userMenuSectionTitle,
            userMenuOptionsGroup
        ]);

        //test role that has permissions [Permissions.ACCOUNT_WRITE, Permissions.ACCOUNT_READ];
        await mockSessionStorageService.save({ ...defaultAuthDatas, role: Roles.UserManager });
        menuByRoleBuilderService = new MenuByRoleBuilderService(mockSessionStorageService, fakeMenu);
        menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            {
                title: 'articles',
                children: [
                    {
                        title: 'articles',
                    }
                ]
            },
            userMenuSectionTitle,
            userMenuOptionsGroup
        ]);

        //test role that has permissions [Permissions.ACCOUNT_READ];
        await mockSessionStorageService.save({ ...defaultAuthDatas, role: Roles.Supervisor });
        menuByRoleBuilderService = new MenuByRoleBuilderService(mockSessionStorageService, fakeMenu);
        menuResult = menuByRoleBuilderService.buildMenu();
        expect(menuResult).toEqual([
            ...responseMenuAlwaysReturned,
            {
                title: 'articles',
                children: [
                    {
                        title: 'articles',
                    }
                ]
            },
            userMenuSectionTitle, {
                title: 'User',
                permission: Permissions.ACCOUNT_READ,
                children: [
                    {
                        title: 'users',
                        permission: Permissions.ACCOUNT_READ
                    }
                ]
            }
        ]);

    });

});