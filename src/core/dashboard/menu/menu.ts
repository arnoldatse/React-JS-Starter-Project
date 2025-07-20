import Permission from "core/authUser/auth/entities/Permission"
import DashboardNavigationLocation from "core/navigation/DashboardNavigationLocation";
import { StringsKey } from "core/internationalization/strings";
import Colors from "core/colors/Colors";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";

export type MenuSectionTitle = {
    permission?: Permission;
    sectionTitle: string;
}

export type MenuOptionsGroup = {
    permission?: Permission;
    icon?: string;
    title: StringsKey;
    badgeContent?: string;
    badgeColor?: Colors;
    children: (MenuOptionsGroup | MenuOption)[];
}

export type MenuOption = {
    permission?: Permission;
    disabled?: boolean;
    icon?: string;
    location: PublicNavigationLocation | DashboardNavigationLocation;
    title: StringsKey;
    badgeContent?: string;
    badgeColor?: Colors;
    externalLink?: boolean;
    openInNewTab?: boolean;
}

export type MenuItem = MenuOption | MenuOptionsGroup | MenuSectionTitle

export type Menu = MenuItem[]

const menu: Menu = [
    {
        location: DashboardNavigationLocation.DASHBOARD,
        title: StringsKey.dashboard
    },
    {
        title: StringsKey.email,
        children: [
            {
                location: DashboardNavigationLocation.OTHER,
                title: StringsKey.other,
            }
        ]
    }
];

export default menu;