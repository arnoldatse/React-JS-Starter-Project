import permissionGuard from "core/user/auth/guards/permissionGuard/permissionGuard";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import routesPaths from "core/routes/routesPaths";
import { RouteObject, redirect } from "react-router";
import DashboardPage from "app/pages/dashboard/DashboardPage";
import OtherPage from "app/pages/dashboard/OtherPage";
import DashboardErrorsLayout from "app/pages/dashboard/errors/layout/DashboardErrorsLayout";
import UnauthorizedErrorPage from "app/pages/dashboard/errors/UnauthorizedErrorPage";
import NotFoundErrorPage from "app/pages/dashboard/errors/NotFoundErrorPage";
import ServerErrorPage from "app/pages/dashboard/errors/ServerErrorPage";

/**
 * get matching component for the dashboard path
 * @param path
 * @returns
 */
const getDashboardPathComponent = (path: string) => {
  switch (path) {
    case routesPaths.DASHBOARD.HOME_RELATIVE:
      return <DashboardPage />;
    case routesPaths.DASHBOARD.OTHER_RELATIVE:
      return <OtherPage />;
    case routesPaths.DASHBOARD.ERROR.UNAUTHORIZED_RELATIVE:
      return <UnauthorizedErrorPage />;
    case routesPaths.DASHBOARD.ERROR.NOT_FOUND_RELATIVE:
      return <NotFoundErrorPage />;
    case routesPaths.DASHBOARD.ERROR.SERVER_ERROR_RELATIVE:
      return <ServerErrorPage />;
    default:
      return null;
  }
};

/**
 * get the dashboard errors routes list
 * @param dashboardErrorsRouterManager
 * @returns
 */
const getDahsboardErrorsRoutes = (
  dashboardErrorsRouterManager: RouterManager<RouterManagerRoute>
): RouteObject[] => {
  return dashboardErrorsRouterManager.getRoutes().map((route) => ({
    path: route.path,
    element: getDashboardPathComponent(route.path),
  }));
};

/**
 * get the dashboard routes list
 * @returns
 */
const getDashboardRoutes = (
  dashboardRouterManager: RouterManager<RouterManagerRoute>,
  dashboardErrorsRouterManager: RouterManager<RouterManagerRoute>,
  sessionStorageService: SessionStorageService
): RouteObject[] => {
  const dashboardRoutes: RouteObject[] = dashboardRouterManager
    .getRoutes()
    .map((route) => ({
      path: route.path,
      loader: () => {
        if (
          route.permission &&
          !permissionGuard(sessionStorageService, route.permission)
        ) {
          return redirect(`/${routesPaths.DASHBOARD.ERROR.UNAUTHORIZED}`);
        }
        return null;
      },
      element: getDashboardPathComponent(route.path),
    }));

  // Add errors routes
  dashboardRoutes.push({
    path: routesPaths.DASHBOARD.ERROR.ROOT_RELATIVE,
    element: <DashboardErrorsLayout />,
    children: getDahsboardErrorsRoutes(dashboardErrorsRouterManager),
  });

  return dashboardRoutes;
};

export default getDashboardRoutes;
