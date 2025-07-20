import DashboardNavigationLocation from "./DashboardNavigationLocation";
import PublicNavigationLocation from "./PublicNavigationLocation";

export type NavigationLocations = PublicNavigationLocation | DashboardNavigationLocation;

export interface LocationInstance {
    location: NavigationLocations;
    parameters?: Record<string, string | number>;
}

/**
 * Interface representing a navigator for handling application navigation.
 */
export default interface AppNavigator {
    /**
     * Navigates to the specified location with optional parameters.
     * @param location - The target navigation location.
     * @param parameters - Optional parameters to pass to the location.
     */
    navigate(location: NavigationLocations, parameters?: Record<string, string | number>): void;

    /**
     * Clears the navigation history and navigates to the specified location with optional parameters.
     * @param location - The target navigation location.
     * @param parameters - Optional parameters to pass to the location.
     */
    clearHistoryAndNavigate(location: NavigationLocations, parameters?: Record<string, string | number>): void;

    /**
     * Redirects to the specified location with optional parameters by replacing the last location with the new.
     * @param location - The target navigation location.
     * @param parameters - Optional parameters to pass to the location.
     */
    redirect(location: NavigationLocations, parameters?: Record<string, string | number>): void;

    /**
     * Clears the navigation history.
     */
    clearHistory(): void;

    /**
     * Checks if navigation to the previous location is possible.
     * @returns True if navigation to the previous location is possible, otherwise false.
     */
    canNavigateToPreviousLocation(): boolean;

    /**
     * Navigates to the previous location.
     */
    navigateToPreviousLocation(): void;

    /**
     * Checks if navigation to the next location is possible.
     * @returns True if navigation to the next location is possible, otherwise false.
     */
    canNavigateToNextLocation(): boolean;

    /**
     * Navigates to the next location.
     */
    navigateToNextLocation(): void;

    /**
     * Gets the previous location instance.
     * @returns The previous location instance or null if there is no previous location.
     */
    getPreviousLocation(): LocationInstance | null;

    /**
     * Gets the current location instance.
     * @returns The current location instance.
     */
    getCurrentLocation(): LocationInstance;

    /**
     * Gets the next location instance.
     * @returns The next location instance or null if there is no next location.
     */
    getNextLocation(): LocationInstance | null;
}

