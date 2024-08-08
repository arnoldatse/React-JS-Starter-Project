import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import routesPaths from "core/routes/routesPaths";

const routes: RouterManagerRoute[] = [
  {
    path: routesPaths.HOME,
  },
  {
    path: routesPaths.LOGIN,
  }
];

const publicRouterManager = new RouterManager(routes);

export default publicRouterManager;