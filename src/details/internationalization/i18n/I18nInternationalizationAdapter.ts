import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { AvailableLanguages, defaultLanguage } from "core/internationalization/languages";
import { fr, en } from "core/internationalization/strings";
import InternationalizationAdapter from "core/internationalization/InternationalizationAdapter";
import LanguageDetector from "i18next-browser-languagedetector";
import LocalStorageLanguageRepository from "details/storage/localStorage/repositories/LocalStorageLanguageRepository";

export default class i18nInternationalizationAdapter implements InternationalizationAdapter {
  private browserLanguage(): AvailableLanguages {
    const browserLanguage = navigator.language;
    return browserLanguage.split("-")[0] as AvailableLanguages;
  }
  private async getLanguage(languageRepository: LocalStorageLanguageRepository): Promise<AvailableLanguages> {
    try {
      return (await languageRepository.getCurrentLanguage()).code;
    }
    catch (error) {
      return this.browserLanguage();
    }
  }
  async init(languageRepository: LocalStorageLanguageRepository): Promise<void> {
    i18n
      .use(initReactI18next)
      .use(LanguageDetector)
      .init({
        lng: await this.getLanguage(languageRepository),
        fallbackLng: defaultLanguage.code,
        interpolation: {
          escapeValue: false,
        },
        resources: {
          fr: {
            translation: {
              ...fr,
            },
          },
          en: {
            translation: {
              ...en,
            },
          },
        },
      });
  }
}
