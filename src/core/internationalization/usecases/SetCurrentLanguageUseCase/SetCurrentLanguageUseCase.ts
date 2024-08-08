import LanguageRepository from "../../LanguageRepository";
import { Language } from "../../languages";

export default class SetCurrentLanguageUseCase {
    constructor(private languageRepository: LanguageRepository) { }

    execute(language: Language): Promise<void> {
        return this.languageRepository.setCurrentLanguage(language);
    }
}