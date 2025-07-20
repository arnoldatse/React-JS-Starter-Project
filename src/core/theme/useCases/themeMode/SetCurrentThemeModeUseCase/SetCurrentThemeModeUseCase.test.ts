import SetCurrentThemeModeUseCase from "./SetCurrentThemeModeUseCase";
import ThemeModeRepository from "../../../ThemeModeRepository";

describe("SetCurrentThemeModeUseCase", () => {
    let mockThemeModeRepository: jest.Mocked<ThemeModeRepository<string>>;
    let setCurrentThemeModeUseCase: SetCurrentThemeModeUseCase<string>;

    beforeEach(() => {
        mockThemeModeRepository = {
            setCurrentThemeMode: jest.fn(),
        } as unknown as jest.Mocked<ThemeModeRepository<string>>;

        setCurrentThemeModeUseCase = new SetCurrentThemeModeUseCase(mockThemeModeRepository);
    });

    it("should call themeModeRepository.setCurrentThemeMode with the correct theme mode", async () => {
        const themeMode = "dark";

        await setCurrentThemeModeUseCase.execute(themeMode);

        expect(mockThemeModeRepository.setCurrentThemeMode).toHaveBeenCalledWith(themeMode);
        expect(mockThemeModeRepository.setCurrentThemeMode).toHaveBeenCalledTimes(1);
    });

    it("should throw an error if themeModeRepository.setCurrentThemeMode fails", async () => {
        const themeMode = "dark";
        const error = new Error("Failed to set theme mode");

        mockThemeModeRepository.setCurrentThemeMode.mockRejectedValue(error);

        await expect(setCurrentThemeModeUseCase.execute(themeMode)).rejects.toThrow(error);
    });
});