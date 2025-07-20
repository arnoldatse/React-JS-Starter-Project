import { FC, useEffect, useMemo } from "react";
import AppContext, {
  AppContext as AppContextType,
  defaultAppContext,
} from "./AppContext";
import ViteEnv from "details/env/vite/ViteEnv";
import useLanguage from "../hooks/useLanguage";

const AppContextProvider: FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const language = useLanguage();

  const appContextValue = useMemo<AppContextType>(
    () => ({
      ...defaultAppContext,
      language,
    }),
    [language]
  );

  useEffect(() => {
    appContextValue.logger.defineLogActivity(new ViteEnv());
  }, [appContextValue.logger]);

  return (
    <AppContext.Provider value={appContextValue}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
