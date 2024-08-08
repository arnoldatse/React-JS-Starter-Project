import { useState } from 'react';
import languageRepository from 'app/repositories/languageRepository';
import { Language, languages } from 'core/internationalization/languages';
import { useTranslation } from 'react-i18next';

let currentLanguage: Language;
try{
    currentLanguage = await languageRepository.getCurrentLanguage();
}
catch(error){
    console.warn('No language found, setting default language');
    currentLanguage = languages.en;
}

export type UseLanguageResponse = {
    currentLanguage: Language,
    updateLanguage: (language: Language) => void,
    translate: (key: string) => string,
}

const useLanguage = (): UseLanguageResponse => {
    const { i18n, t } = useTranslation();
    const [language, setLanguage] = useState<Language>(currentLanguage);

    const updateLanguage = async (language: Language) => {
        i18n.changeLanguage(language.code);
        await languageRepository.setCurrentLanguage(language);
        setLanguage(language);
    }

    return {
        currentLanguage: language,
        updateLanguage,
        translate: t,
    }
}

export default useLanguage;