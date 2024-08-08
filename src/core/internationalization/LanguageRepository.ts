import { Language } from "./languages";

export default interface LanguageRepository {
    getCurrentLanguage(): Promise<Language>
    setCurrentLanguage(language: Language): Promise<void>
}