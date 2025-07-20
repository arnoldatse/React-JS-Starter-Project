import BrowserDateService from "./BrowserDateService";
import { AvailableLanguages } from "core/internationalization/languages";

describe("BrowserDateService", () => {
    let browserDateService: BrowserDateService;

    beforeEach(() => {
        browserDateService = new BrowserDateService();
    });

    describe("getFrDate", () => {
        it("should return the date formatted in French locale", () => {
            const date = new Date("2023-03-15T00:00:00");
            const result = browserDateService.getFrDate(date);
            expect(result).toBe("15/03/2023");
        });
    });

    describe("getEnDate", () => {
        it("should return the date formatted in English (US) locale", () => {
            const date = new Date("2023-03-15T00:00:00");
            const result = browserDateService.getEnDate(date);
            expect(result).toBe("3/15/2023");
        });
    });

    describe("formatDate", () => {
        it("should format the date in French when language is fr", () => {
            const date = new Date("2023-03-15T00:00:00");
            const result = browserDateService.formatDate(date, AvailableLanguages.fr);
            expect(result).toBe("15/03/2023");
        });

        it("should format the date in English when language is en", () => {
            const date = new Date("2023-03-15T00:00:00");
            const result = browserDateService.formatDate(date, AvailableLanguages.en);
            expect(result).toBe("3/15/2023");
        });
    });

    describe("getTime", () => {
        it("should return the time in HH:mm format", () => {
            const date = new Date("2023-03-15T08:05:00");
            const result = browserDateService.getTime(date);
            expect(result).toBe("08:05");
        });

        it("should handle single-digit hours and minutes correctly", () => {
            const date = new Date("2023-03-15T03:04:00");
            const result = browserDateService.getTime(date);
            expect(result).toBe("03:04");
        });
    });

    describe("formatDateTime", () => {
        it("should format the date and time in French locale", () => {
            const date = new Date("2023-03-15T08:05:00");
            const result = browserDateService.formatDateTime(date, AvailableLanguages.fr);
            expect(result).toBe("15/03/2023 08:05");
        });

        it("should format the date and time in English locale", () => {
            const date = new Date("2023-03-15T08:05:00");
            const result = browserDateService.formatDateTime(date, AvailableLanguages.en);
            expect(result).toBe("3/15/2023 08:05");
        });
    });
});