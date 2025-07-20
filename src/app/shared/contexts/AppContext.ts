import { createContext } from "react";
import { defaultLanguage, Language } from "core/internationalization/languages";
import Logger from "core/log/Logger";
import AppNavigator from "core/navigation/AppNavigator";
import SessionStorageService from "core/authUser/auth/services/sessionStorageService/SessionStorageService";
import BrowserNavigator from "details/navigation/browser/browserNavigator/BrowserNavigator";
import sessionStorageService from "app/shared/services/internationalization/sessionStorageService";
import { UseLanguageResponse } from "../hooks/useLanguage";

export interface AppContext {
    sessionStorageService: SessionStorageService;
    language: UseLanguageResponse;
    navigator: AppNavigator;
    logger: Logger;
}

export const defaultAppContext: AppContext = {
    sessionStorageService: sessionStorageService,
    language: {
        currentLanguage: defaultLanguage,
        updateLanguage: (_: Language) => { },
        translate: (_: string) => ""
    },
    navigator: new BrowserNavigator((_: string) => { }),
    logger: Logger.getInstance()
}

export default createContext(defaultAppContext);