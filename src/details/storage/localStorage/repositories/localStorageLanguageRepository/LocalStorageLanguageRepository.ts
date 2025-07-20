import LanguageRepository from "core/internationalization/LanguageRepository";
import { Language } from "core/internationalization/languages";
import LocalStorage from "../../LocalStorage";
import StorageKeys from "core/storage/StorageKeys";

class LocalStorageLanguageRepository implements LanguageRepository {
    private readonly localStorage = new LocalStorage();

    getCurrentLanguage(): Promise<Language> {
        return new Promise((resolve, reject) => {
            try {
                const language = this.localStorage.getItem(StorageKeys.LANGUAGE);
                if (!language) {
                    throw new Error("No language found");
                }
                resolve(JSON.parse(language));
            } catch (error) {
                reject(error);
            }
        });
    }
    setCurrentLanguage(language: Language): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.localStorage.setItem(StorageKeys.LANGUAGE, JSON.stringify(language));
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default LocalStorageLanguageRepository;