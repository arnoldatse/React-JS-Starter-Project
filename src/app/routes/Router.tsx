import { FC } from "react";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import {
  createHashRouter,
  redirect,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import routesPaths from "core/routes/routesPaths";
import authGuard from "core/user/auth/guards/authGuard/authGuard";
import PublicLayout from "app/pages/public/layout/PublicLayout";
import DashboardLayout from "app/pages/dashboard/layout/DashboardLayout";
import getDashboardRoutes from "./dashboardRoutes";
import getPublicRoutes from "./publicRoutes";

type RouterComponent = FC<{
  sessionStorageService: SessionStorageService;
  publicRouterManager: RouterManager<RouterManagerRoute>;
  publicErrorsRouterManager: RouterManager<RouterManagerRoute>;
  dashboardRouterManager: RouterManager<RouterManagerRoute>;
  dashboardErrorsRouterManager: RouterManager<RouterManagerRoute>;
}>;

const Router: RouterComponent = ({
  sessionStorageService,
  publicRouterManager,
  publicErrorsRouterManager,
  dashboardRouterManager,
  dashboardErrorsRouterManager,
}) => {
  //define react router routes
  const routes: RouteObject[] = [
    {
      path: routesPaths.ROOT,
      element: <PublicLayout />,
      children: getPublicRoutes(
        publicRouterManager,
        publicErrorsRouterManager,
        sessionStorageService
      ),
    },
    {
      path: routesPaths.DASHBOARD.ROOT,
      loader: () => {
        if (authGuard(sessionStorageService)) {
          return null;
        }
        return redirect(`/${routesPaths.LOGIN}`);
      },
      element: <DashboardLayout />,
      children: getDashboardRoutes(
        dashboardRouterManager,
        dashboardErrorsRouterManager,
        sessionStorageService
      ),
    },
    {
      path: `${routesPaths.DASHBOARD.ROOT}/*`,
      loader: () => redirect(`/${routesPaths.DASHBOARD.ERROR.NOT_FOUND}`),
      element: <></>,
    },
    {
      path: "*",
      loader: () => redirect(`/${routesPaths.ERROR.NOT_FOUND}`),
      element: <></>,
    },
  ];

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
};

export default Router;
