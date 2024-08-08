import ThemeModeRepository from "../../ThemeModeRepository";

export default class GetCurrentThemeModeUseCase<T> {
    constructor(private themeModeRepository: ThemeModeRepository<T>) {
    }
    async execute() {
        return await this.themeModeRepository.getCurrentThemeMode();
    }
}