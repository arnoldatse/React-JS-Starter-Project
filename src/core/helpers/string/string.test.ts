import { conditionalStringRenderer } from "./string";
import DefaultStrings from "core/constants/DefaultStrings";

describe("conditionalStringRenderer", () => {
    it("should return the trimmed string if it is not null, undefined, or empty", () => {
        expect(conditionalStringRenderer("  Hello World  ")).toBe("Hello World");
    });

    it("should return the default string if the input is null", () => {
        expect(conditionalStringRenderer(null)).toBe(DefaultStrings.NOT_AVAILABLE);
    });

    it("should return the default string if the input is undefined", () => {
        expect(conditionalStringRenderer(undefined)).toBe(DefaultStrings.NOT_AVAILABLE);
    });

    it("should return the default string if the input is an empty string", () => {
        expect(conditionalStringRenderer("")).toBe(DefaultStrings.NOT_AVAILABLE);
    });

    it("should return the default string if the input is a string with only spaces", () => {
        expect(conditionalStringRenderer("   ")).toBe(DefaultStrings.NOT_AVAILABLE);
    });
});