import SetCurrentNavCollapsedUseCase from "./SetCurrentNavCollapsedUseCase";
import NavCollapsedRepository from "core/theme/NavCollapsedRepository";

describe("SetCurrentNavCollapsedUseCase", () => {
    let navCollapsedRepository: jest.Mocked<NavCollapsedRepository>;
    let setCurrentNavCollapsedUseCase: SetCurrentNavCollapsedUseCase;

    beforeEach(() => {
        navCollapsedRepository = {
            setCurrentNavCollapsed: jest.fn(),
        } as unknown as jest.Mocked<NavCollapsedRepository>;

        setCurrentNavCollapsedUseCase = new SetCurrentNavCollapsedUseCase(navCollapsedRepository);
    });

    it("should call navCollapsedRepository.setCurrentNavCollapsed with the correct value", async () => {
        const navCollapsed = true;

        await setCurrentNavCollapsedUseCase.execute(navCollapsed);

        expect(navCollapsedRepository.setCurrentNavCollapsed).toHaveBeenCalledWith(navCollapsed);
    });

    it("should throw an error if navCollapsedRepository.setCurrentNavCollapsed fails", async () => {
        const navCollapsed = true;
        const error = new Error("Repository error");
        navCollapsedRepository.setCurrentNavCollapsed.mockRejectedValue(error);

        await expect(setCurrentNavCollapsedUseCase.execute(navCollapsed)).rejects.toThrow(error);
    });
});