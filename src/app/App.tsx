import { FC } from "react";
import Router from "./routes/Router";
import LocalStorageLanguageRepository from "details/storage/localStorage/repositories/localStorageLanguageRepository/LocalStorageLanguageRepository";
import internationalizationService from "./shared/services/internationalizationService";
import AppContextProvider from "./shared/contexts/AppContextProvider";

internationalizationService.init(new LocalStorageLanguageRepository());

const App: FC = () => {
  return (
    <AppContextProvider>
      <Router />
    </AppContextProvider>
  );
};

export default App;
