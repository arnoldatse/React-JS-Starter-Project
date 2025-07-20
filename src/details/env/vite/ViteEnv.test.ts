import ViteEnv from "./ViteEnv";

describe("ViteEnv", () => {
    let viteEnv: ViteEnv;

    beforeEach(() => {
        viteEnv = new ViteEnv();
    });

    it("should return the correct value from import.meta.env when the key exists", () => {
        const mockKey = "TEST_KEY";
        const mockValue = "test_value";

        // Mock import.meta.env
        (import.meta as any).env = {
            [`VITE_${mockKey}`]: mockValue,
        };

        const result = viteEnv.get(mockKey);
        expect(result).toBe(mockValue);
    });

    it("should return undefined when the key does not exist in import.meta.env", () => {
        const mockKey = "NON_EXISTENT_KEY";

        // Mock import.meta.env
        (import.meta as any).env = {};

        const result = viteEnv.get(mockKey);
        expect(result).toBeUndefined();
    });
});