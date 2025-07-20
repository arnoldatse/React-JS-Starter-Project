import GetCurrentThemeModeUseCase from "./GetCurrentThemeModeUseCase";
import ThemeModeRepository from "../../../ThemeModeRepository";

describe("GetCurrentThemeModeUseCase", () => {
    let themeModeRepositoryMock: jest.Mocked<ThemeModeRepository<string>>;
    let getCurrentThemeModeUseCase: GetCurrentThemeModeUseCase<string>;

    beforeEach(() => {
        themeModeRepositoryMock = {
            getCurrentThemeMode: jest.fn(),
        } as unknown as jest.Mocked<ThemeModeRepository<string>>;

        getCurrentThemeModeUseCase = new GetCurrentThemeModeUseCase(themeModeRepositoryMock);
    });

    it("should return the current theme mode from the repository", async () => {
        const mockThemeMode = "dark";
        themeModeRepositoryMock.getCurrentThemeMode.mockResolvedValue(mockThemeMode);

        const result = await getCurrentThemeModeUseCase.execute();

        expect(themeModeRepositoryMock.getCurrentThemeMode).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockThemeMode);
    });

    it("should propagate errors from the repository", async () => {
        const mockError = new Error("Repository error");
        themeModeRepositoryMock.getCurrentThemeMode.mockRejectedValue(mockError);

        await expect(getCurrentThemeModeUseCase.execute()).rejects.toThrow(mockError);
        expect(themeModeRepositoryMock.getCurrentThemeMode).toHaveBeenCalledTimes(1);
    });
});