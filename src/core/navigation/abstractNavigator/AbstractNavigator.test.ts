import AbstractNavigator from "./AbstractNavigator";
import { NavigationLocations } from "../AppNavigator";
import PublicNavigationLocation from "../PublicNavigationLocation";

class TestNavigator extends AbstractNavigator {
    protected navigateToLocation(location: NavigationLocations, parameters?: Record<string, string | number>): void {
        // Mock implementation for testing
    }
}

describe("AbstractNavigator", () => {
    let navigator: TestNavigator;

    beforeEach(() => {
        navigator = new TestNavigator();
    });

    it("should navigate to a location and update history", () => {
        const location = PublicNavigationLocation.HOME;
        const parameters = { id: 1 };

        navigator.navigate(location, parameters);

        expect(navigator.getCurrentLocation()).toEqual({
            location,
            parameters,
        });
        expect(navigator.canNavigateToPreviousLocation()).toBe(false);
    });

    it("should clear history and navigate to a new location", () => {
        const location = PublicNavigationLocation.HOME;

        navigator.navigate(location);
        navigator.clearHistoryAndNavigate(location);

        expect(navigator.getCurrentLocation()).toEqual({
            location,
            parameters: undefined,
        });
        expect(navigator.canNavigateToPreviousLocation()).toBe(false);
    });

    it("should navigate to the previous location if possible", () => {
        const location = PublicNavigationLocation.HOME;

        navigator.navigate(location);
        navigator.navigate(location);

        expect(navigator.canNavigateToPreviousLocation()).toBe(true);

        navigator.navigateToPreviousLocation();

        expect(navigator.getCurrentLocation()).toEqual({
            location,
            parameters: undefined,
        });
    });

    it("should navigate to the next location if possible", () => {
        const location = PublicNavigationLocation.HOME;

        navigator.navigate(location);
        navigator.navigate(location);
        navigator.navigateToPreviousLocation();

        expect(navigator.canNavigateToNextLocation()).toBe(true);

        navigator.navigateToNextLocation();

        expect(navigator.getCurrentLocation()).toEqual({
            location,
            parameters: undefined,
        });
    });

    it("should return null for previous location if none exists", () => {
        expect(navigator.getPreviousLocation()).toBeNull();
    });

    it("should return null for next location if none exists", () => {
        expect(navigator.getNextLocation()).toBeNull();
    });

    it("should clear history", () => {
        const location = PublicNavigationLocation.HOME;

        navigator.navigate(location);
        navigator.clearHistory();

        expect(navigator.getCurrentLocation()).toEqual({
            location: PublicNavigationLocation.HOME,
        });
        expect(navigator.canNavigateToPreviousLocation()).toBe(false);
        expect(navigator.canNavigateToNextLocation()).toBe(false);
    });

    it("should redirect to a new location", () => {
        const location = PublicNavigationLocation.HOME;

        navigator.navigate(location);
        navigator.redirect(location);

        expect(navigator.getCurrentLocation()).toEqual({
            location,
            parameters: undefined,
        });
    });
});