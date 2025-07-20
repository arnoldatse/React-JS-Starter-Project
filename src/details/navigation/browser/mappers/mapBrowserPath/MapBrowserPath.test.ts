import MapBrowserPath from "./MapBrowserPath";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";
import DashboardNavigationLocation from "core/navigation/DashboardNavigationLocation";
import browserPaths from "../../browserPaths";

describe("MapBrowserPath", () => {
    describe("mapToBrowserPath", () => {
        it("should return the correct browser path for PublicNavigationLocation.HOME", () => {
            const result = MapBrowserPath.mapToBrowserPath(PublicNavigationLocation.HOME);
            expect(result).toBe(browserPaths.HOME);
        });

        it("should return the correct browser path for DashboardNavigationLocation.DASHBOARD", () => {
            const result = MapBrowserPath.mapToBrowserPath(DashboardNavigationLocation.DASHBOARD);
            expect(result).toBe(browserPaths.DASHBOARD.HOME);
        });

        it("should throw an error for an unknown location", () => {
            expect(() => {
                MapBrowserPath.mapToBrowserPath("UNKNOWN_LOCATION" as PublicNavigationLocation | DashboardNavigationLocation);
            }).toThrowError("Unknown location: UNKNOWN_LOCATION");
        });
    });

    describe("mapToBrowserRelativePath", () => {
        it("should return the correct relative browser path for DashboardNavigationLocation.DASHBOARD", () => {
            const result = MapBrowserPath.mapToBrowserRelativePath(DashboardNavigationLocation.DASHBOARD);
            expect(result).toBe(browserPaths.DASHBOARD.HOME_RELATIVE);
        });

        it("should throw an error for an unknown location", () => {
            expect(() => {
                MapBrowserPath.mapToBrowserRelativePath("UNKNOWN_LOCATION" as PublicNavigationLocation | DashboardNavigationLocation);
            }).toThrowError("Unknown location: UNKNOWN_LOCATION");
        });
    });
});