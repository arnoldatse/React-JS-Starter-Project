import NavCollapsedRepository from "core/theme/NavCollapsedRepository";

export default class GetCurrentNavCollapsedUseCase {
    constructor(private navCollapsedRepository: NavCollapsedRepository) {
    }
    async execute() {
        return await this.navCollapsedRepository.getCurrentNavCollapsed();
    }
}