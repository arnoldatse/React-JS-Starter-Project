import { FC } from "react";
import Router from "./routes/Router";
import internationalizationService from "./services/internationalization";

import "details/internationalization/i18n/I18nInternationalizationAdapter";
import "details/datas/backend/rest/mock/miragejs";
import languageRepository from "./repositories/languageRepository";
import LocalStorageAuthDatasRepository from "details/storage/localStorage/repositories/localStorageAuthDatasRepository/LocalStorageAuthDatasRepository";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import publicRouterManager from "core/routes/routerManagers/publicRouterManagers/publicRouterManager/publicRouterManager";
import publicErrorsRouterManager from "core/routes/routerManagers/publicRouterManagers/publicErrorsRouterManager/publicErrorsRouterManager";
import dashboardRouterManager from "core/routes/routerManagers/dashboardRouterManagers/dashboardRouterManager/dashboardRouterManager";
import dashboardErrorsRouterManager from "core/routes/routerManagers/dashboardRouterManagers/dashboardErrorsRouterManager/dashboardErrorsRouterManager";

internationalizationService.init(languageRepository);

const App: FC = () => {
  const sessionRepositoryService = SessionStorageService.getInstance(
    new LocalStorageAuthDatasRepository()
  );
  return (
    <Router
      sessionStorageService={sessionRepositoryService}
      publicRouterManager={publicRouterManager}
      publicErrorsRouterManager={publicErrorsRouterManager}
      dashboardRouterManager={dashboardRouterManager}
      dashboardErrorsRouterManager={dashboardErrorsRouterManager}
    />
  );
};

export default App;
