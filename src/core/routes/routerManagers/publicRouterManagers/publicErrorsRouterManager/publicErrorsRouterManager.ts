import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import routesPaths from "core/routes/routesPaths";

const routes: RouterManagerRoute[] = [
  {
    path: routesPaths.ERROR.NOT_FOUND_RELATIVE,
  },
  {
    path: routesPaths.ERROR.SERVER_ERROR_RELATIVE,
  }
];

const publicErrorsRouterManager = new RouterManager(routes);

export default publicErrorsRouterManager;