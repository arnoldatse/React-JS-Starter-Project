import LanguageRepository from "../../LanguageRepository";
import { Language } from "../../languages";

export default class GetCurrentLanguageUsecase {
    constructor(private languageRepository: LanguageRepository) { }

    execute(): Promise<Language> {
        return this.languageRepository.getCurrentLanguage();
    }
}