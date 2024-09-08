import Permissions from "core/user/auth/entities/Permissions"
import routesPaths from "core/routes/routesPaths"
import { StringsKeys } from "core/internationalization/strings";

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

export type Menu = (MenuOption | MenuOptionsGroup | MenuSectionTitle)[]

const menu: Menu = [
    {
        path: routesPaths.DASHBOARD.ROOT,
        title: StringsKeys.dashbord
    },
    {
        path: routesPaths.DASHBOARD.OTHER,
        title: StringsKeys.other
    }
];

export default menu;