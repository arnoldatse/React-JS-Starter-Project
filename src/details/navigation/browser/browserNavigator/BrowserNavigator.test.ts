import BrowserNavigator from "./BrowserNavigator";

jest.mock("../mappers/mapBrowserPath/MapBrowserPath", () => ({
    mapToBrowserPath: jest.fn(),
}));

describe("BrowserNavigator", () => {
    let mockNavigate: jest.Mock;
    let browserNavigator: BrowserNavigator;

    beforeEach(() => {
        mockNavigate = jest.fn();
        browserNavigator = new BrowserNavigator(mockNavigate);
    });

    describe("setNavigate and getNavigate", () => {
        it("should set and get the navigate function", () => {
            const newNavigate = jest.fn();
            browserNavigator.setNavigate(newNavigate);
            expect(browserNavigator.getNavigate()).toBe(newNavigate);
        });
    });
});