import LanguageRepository from "../../LanguageRepository";
import { Language } from "../../languages";

export default class GetCurrentLanguageUseCase {
    constructor(private readonly languageRepository: LanguageRepository) { }

    execute(): Promise<Language> {
        return this.languageRepository.getCurrentLanguage();
    }
}