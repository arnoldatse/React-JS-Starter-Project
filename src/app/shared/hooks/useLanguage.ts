import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { defaultLanguage, Language } from 'core/internationalization/languages'
import { StringsKey } from 'core/internationalization/strings'
import GetCurrentLanguageUseCase from 'core/internationalization/useCases/GetCurrentLanguageUseCase/GetCurrentLanguageUseCase'
import SetCurrentLanguageUseCase from 'core/internationalization/useCases/SetCurrentLanguageUseCase/SetCurrentLanguageUseCase'
import languageRepository from 'app/shared/repositories/languageRepository'

enum InitHookStates {
    NOT_INITIALIZED,
    INITIALIZING,
    INITIALIZED,
}

export type UseLanguageResponse = {
    currentLanguage: Language,
    updateLanguage: (language: Language) => void,
    translate: (key: StringsKey) => string,
}

const useLanguage = (): UseLanguageResponse => {
    const [currentLanguage, setCurrentLanguage] = useState<Language>(defaultLanguage);
    const initHook = useRef(InitHookStates.NOT_INITIALIZED);

    const { i18n, t } = useTranslation();

    const updateLanguage = (language: Language) => {
        i18n.changeLanguage(language.code);
        new SetCurrentLanguageUseCase(languageRepository).execute(language).then(() => setCurrentLanguage(language));
    }

    useEffect(() => {
        if (initHook.current === InitHookStates.NOT_INITIALIZED) {
            initHook.current = InitHookStates.INITIALIZING;
            new GetCurrentLanguageUseCase(languageRepository).execute()
                .then(setCurrentLanguage)
                .finally(() => initHook.current = InitHookStates.INITIALIZED);
        }
    }, []);

    return {
        currentLanguage,
        updateLanguage,
        translate: t,
    }
}

export default useLanguage;