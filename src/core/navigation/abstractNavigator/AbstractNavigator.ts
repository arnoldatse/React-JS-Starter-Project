import AppNavigator, { LocationInstance, NavigationLocations } from "../AppNavigator";
import PublicNavigationLocation from "../PublicNavigationLocation";

export interface NavigationHistory {
    location: NavigationLocations;
    parameters?: Record<string, string | number>;
    current: boolean;
}

export default abstract class AbstractNavigator implements AppNavigator {
    protected locationHistory: NavigationHistory[] = [];

    protected abstract navigateToLocation(location: NavigationLocations, parameters?: Record<string, string | number>): void;

    protected getCurrentLocationIndex(): number {
        return this.locationHistory.findIndex((history) => history.current);
    }

    navigate(location: NavigationLocations, parameters?: Record<string, string | number>): void {
        this.navigateToLocation(location, parameters);

        // Set the current location to false for all previous locations
        this.locationHistory.filter((history) => history.current).forEach((history) => history.current = false);

        this.locationHistory.push({
            location,
            parameters,
            current: true
        });
    }

    clearHistoryAndNavigate(location: NavigationLocations, parameters?: Record<string, string | number>): void {
        this.clearHistory();
        this.navigate(location, parameters)
    }

    redirect(location: NavigationLocations, parameters?: Record<string, string | number>): void {
        this.locationHistory.pop();
        this.navigateToLocation(location, parameters);
    }

    clearHistory() {
        this.locationHistory = []
    }

    canNavigateToPreviousLocation(): boolean {
        return this.getCurrentLocationIndex() > 0;
    }

    navigateToPreviousLocation(): void {
        const currentLocationIndex = this.getCurrentLocationIndex();
        const previousNavigationHistory = this.locationHistory[currentLocationIndex - 1];
        if (previousNavigationHistory) {
            this.navigateToLocation(previousNavigationHistory.location, previousNavigationHistory.parameters);
            this.locationHistory[currentLocationIndex].current = false;
            previousNavigationHistory.current = true;
        }
    }

    canNavigateToNextLocation(): boolean {
        return this.getCurrentLocationIndex() < this.locationHistory.length - 1;
    }

    navigateToNextLocation(): void {
        const currentLocationIndex = this.getCurrentLocationIndex();
        const nextNavigationHistory = this.locationHistory[currentLocationIndex + 1];
        if (nextNavigationHistory) {
            this.navigateToLocation(nextNavigationHistory.location, nextNavigationHistory.parameters);
            this.locationHistory[currentLocationIndex].current = false;
            nextNavigationHistory.current = true;
        }
    }

    getPreviousLocation(): LocationInstance | null {
        const currentLocationIndex = this.getCurrentLocationIndex();
        const previousNavigationHistory = this.locationHistory[currentLocationIndex - 1];
        return previousNavigationHistory ?
            { location: previousNavigationHistory.location, parameters: previousNavigationHistory.parameters } :
            null;
    }

    getCurrentLocation(): LocationInstance {
        const currentNavigationHistory = this.locationHistory.find((history) => history.current);
        return currentNavigationHistory ?
            { location: currentNavigationHistory.location, parameters: currentNavigationHistory.parameters } :
            { location: PublicNavigationLocation.HOME };
    }

    getNextLocation(): LocationInstance | null {
        const currentLocationIndex = this.getCurrentLocationIndex();
        const nextNavigationHistory = this.locationHistory[currentLocationIndex + 1];
        return nextNavigationHistory ?
            { location: nextNavigationHistory.location, parameters: nextNavigationHistory.parameters } :
            null;
    }

}