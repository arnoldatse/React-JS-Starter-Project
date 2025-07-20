import NavCollapsedRepository from "core/theme/NavCollapsedRepository";

export default class GetCurrentNavCollapsedUseCase {
    constructor(private readonly navCollapsedRepository: NavCollapsedRepository) {
    }
    async execute() {
        return await this.navCollapsedRepository.getCurrentNavCollapsed();
    }
}