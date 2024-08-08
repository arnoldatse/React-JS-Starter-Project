export type Direction = "ltr" | "rtl";

export interface Language {
    code: AvailableLanguages;
    direction: Direction;
}

export enum AvailableLanguages {
    fr = "fr",
    en = "en"
}

export const languages: Record<AvailableLanguages, Language> = {
    fr: {
        code: AvailableLanguages.fr,
        direction: "ltr"
    },
    en: {
        code: AvailableLanguages.en,
        direction: "ltr"
    }
}

export const defaultLanguage: Language = { ...languages.fr };