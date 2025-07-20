import AppNavigator from "core/navigation/AppNavigator";
import NavigationLocations from "core/navigation/PublicNavigationLocation";
import AbstractNavigator from "core/navigation/abstractNavigator/AbstractNavigator";
import MapBrowserPath from "../mappers/mapBrowserPath/MapBrowserPath";

export default class BrowserNavigator extends AbstractNavigator implements AppNavigator {
    constructor(private _navigate: (path: string) => void) {
        super();
    }

    private convertParametersInPath(path: string, parameters?: Record<string, string | number>): string {
        if (parameters) {
            Object.keys(parameters).forEach((key) => {
                path = path.replace(`:${key}`, parameters[key].toString());
            });
        }
        return path;
    }

    protected navigateToLocation(location: NavigationLocations, parameters?: Record<string, string | number>) {
        this._navigate(this.convertParametersInPath(MapBrowserPath.mapToBrowserPath(location), parameters));
    }

    setNavigate(navigate: (path: string) => void) {
        this._navigate = navigate;
    }

    getNavigate(){
        return this._navigate;
    }
}