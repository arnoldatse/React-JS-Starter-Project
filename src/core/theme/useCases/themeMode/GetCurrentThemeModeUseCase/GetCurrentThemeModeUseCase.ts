import ThemeModeRepository from "../../../ThemeModeRepository";

export default class GetCurrentThemeModeUseCase<T> {
    constructor(private readonly themeModeRepository: ThemeModeRepository<T>) {
    }
    async execute() {
        return await this.themeModeRepository.getCurrentThemeMode();
    }
}