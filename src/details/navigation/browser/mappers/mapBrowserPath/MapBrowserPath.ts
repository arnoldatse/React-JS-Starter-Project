import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";
import DashboardNavigationLocation from "core/navigation/DashboardNavigationLocation";
import browserPaths from "../../browserPaths";

export default class MapBrowserPath {
    static mapToBrowserPath(location: PublicNavigationLocation | DashboardNavigationLocation): string {
        switch (location) {
            case PublicNavigationLocation.HOME:
                return browserPaths.HOME;
            case PublicNavigationLocation.LOGIN:
                return browserPaths.LOGIN;
            case DashboardNavigationLocation.DASHBOARD:
                return browserPaths.DASHBOARD.HOME;
            case DashboardNavigationLocation.OTHER:
                return browserPaths.DASHBOARD.OTHER;
            default:
                throw new Error(`Unknown location: ${location}`);
        }
    }

    static mapToBrowserRelativePath(location: PublicNavigationLocation | DashboardNavigationLocation): string {
        switch (location) {
            case DashboardNavigationLocation.DASHBOARD:
                return browserPaths.DASHBOARD.HOME_RELATIVE;
            case DashboardNavigationLocation.OTHER:
                return browserPaths.DASHBOARD.OTHER_RELATIVE;
            default:
                throw new Error(`Unknown location: ${location}`);
        }
    }
}