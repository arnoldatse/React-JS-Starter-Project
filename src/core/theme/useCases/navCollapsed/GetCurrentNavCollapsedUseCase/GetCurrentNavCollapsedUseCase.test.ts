import GetCurrentNavCollapsedUseCase from "./GetCurrentNavCollapsedUseCase";
import NavCollapsedRepository from "core/theme/NavCollapsedRepository";

describe("GetCurrentNavCollapsedUseCase", () => {
    let navCollapsedRepository: jest.Mocked<NavCollapsedRepository>;
    let getCurrentNavCollapsedUseCase: GetCurrentNavCollapsedUseCase;

    beforeEach(() => {
        navCollapsedRepository = {
            getCurrentNavCollapsed: jest.fn(),
        } as unknown as jest.Mocked<NavCollapsedRepository>;

        getCurrentNavCollapsedUseCase = new GetCurrentNavCollapsedUseCase(navCollapsedRepository);
    });

    it("should return the current nav collapsed state", async () => {
        const mockNavCollapsedState = true;
        navCollapsedRepository.getCurrentNavCollapsed.mockResolvedValue(mockNavCollapsedState);

        const result = await getCurrentNavCollapsedUseCase.execute();

        expect(navCollapsedRepository.getCurrentNavCollapsed).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockNavCollapsedState);
    });

    it("should propagate errors from the repository", async () => {
        const mockError = new Error("Repository error");
        navCollapsedRepository.getCurrentNavCollapsed.mockRejectedValue(mockError);

        await expect(getCurrentNavCollapsedUseCase.execute()).rejects.toThrow(mockError);
        expect(navCollapsedRepository.getCurrentNavCollapsed).toHaveBeenCalledTimes(1);
    });
});