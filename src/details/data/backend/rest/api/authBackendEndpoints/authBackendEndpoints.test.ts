import { loginUrl, logoutUrl } from "./authBackendEndpoints";

jest.mock("../backendBaseUrl", () => 'http://example.com');

describe("authBackendEndpoints", () => {
    const mockBackendBaseUrl = "http://example.com";

    beforeAll(() => {
        jest.mock("../backendBaseUrl", () => mockBackendBaseUrl);
    });

    describe("loginUrl", () => {
        it("should return the correct login URL", () => {
            const expectedUrl = `${mockBackendBaseUrl}/auth`;
            expect(loginUrl()).toBe(expectedUrl);
        });
    });

    describe("logoutUrl", () => {
        it("should return the correct logout URL with the provided token", () => {
            const token = "sampleToken";
            const expectedUrl = `${mockBackendBaseUrl}/logout/${token}`;
            expect(logoutUrl(token)).toBe(expectedUrl);
        });
    });
});