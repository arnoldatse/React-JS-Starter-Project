import RouterManager, { RouterManagerRoute } from "../../../RouterManager";
import routesPaths from "../../../routesPaths";

const routes: RouterManagerRoute[] = [
  {
    path: routesPaths.DASHBOARD.HOME_RELATIVE,
  },
  {
    path: routesPaths.DASHBOARD.OTHER_RELATIVE,
  }
];

const dashboardRouterManager = new RouterManager(routes);

export default dashboardRouterManager;