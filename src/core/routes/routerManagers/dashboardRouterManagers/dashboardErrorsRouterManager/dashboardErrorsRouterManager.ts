import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import routesPaths from "core/routes/routesPaths";

const routes: RouterManagerRoute[] = [
  {
    path: routesPaths.DASHBOARD.ERROR.UNAUTHORIZED_RELATIVE,
  },
  {
    path: routesPaths.DASHBOARD.ERROR.NOT_FOUND_RELATIVE,
  },
  {
    path: routesPaths.DASHBOARD.ERROR.SERVER_ERROR_RELATIVE,
  }
];

const dashboardErrorsRouterManager = new RouterManager(routes);

export default dashboardErrorsRouterManager;