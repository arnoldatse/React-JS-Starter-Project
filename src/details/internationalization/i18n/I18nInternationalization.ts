import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { AvailableLanguages, defaultLanguage } from "core/internationalization/languages";
import { fr, en } from "core/internationalization/strings";
import Internationalization from "core/internationalization/Internationalization";
import LanguageRepository from "core/internationalization/LanguageRepository";

export default class I18nInternationalization implements Internationalization {
  private browserLanguage(): AvailableLanguages {
    const browserLanguage = navigator.language;
    return browserLanguage.split("-")[0] as AvailableLanguages;
  }
  private async getLanguage(languageRepository: LanguageRepository): Promise<AvailableLanguages> {
    try {
      return (await languageRepository.getCurrentLanguage()).code;
    }
    catch (_: unknown) {
      return this.browserLanguage();
    }
  }
  async init(languageRepository: LanguageRepository): Promise<void> {
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
