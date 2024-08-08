import Permissions from "core/user/auth/entities/Permissions"
import routesPaths from "core/routes/routesPaths"

export type MenuSectionTitle = {
    permission?: Permissions;
    sectionTitle: string;
}

export type MenuOptionsGroup = {
    permission?: Permissions;
    icon?: string;
    title: string;
    badgeContent?: string;
    children: (MenuOptionsGroup | MenuOption)[];
    badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export type MenuOption = {
    permission?: Permissions;
    disabled?: boolean;
    icon?: string;
    path?: string;
    title: string;
    badgeContent?: string;
    externalLink?: boolean;
    openInNewTab?: boolean;
    badgeColor?: 'default' | 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
}

export type MenuType = (MenuOption | MenuOptionsGroup | MenuSectionTitle)[]

const menu: MenuType = [
    {
        icon: 'mdi:home-outline',
        path: routesPaths.DASHBOARD.ROOT,
        title: 'dashbord'
    }
];

export default menu;