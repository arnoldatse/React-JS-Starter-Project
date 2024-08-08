import ThemeModeRepository from "../../ThemeModeRepository";

export default class SetCurrentThemeModeUseCase<T> {
    constructor(private themeModeRepository: ThemeModeRepository<T>) { }

    async execute(themeMode: T) {
        return await this.themeModeRepository.setCurrentThemeMode(themeMode);
    }
}