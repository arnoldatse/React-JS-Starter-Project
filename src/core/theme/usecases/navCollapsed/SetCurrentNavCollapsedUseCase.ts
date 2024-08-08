import NavCollapsedRepository from "core/theme/NavCollapsedRepository";

export default class SetCurrentNavCollapsedUseCase {
    constructor(private navCollapsedRepository: NavCollapsedRepository) { }

    async execute(navCollapsed: boolean) {
        return await this.navCollapsedRepository.setCurrentNavCollapsed(navCollapsed);
    }
}