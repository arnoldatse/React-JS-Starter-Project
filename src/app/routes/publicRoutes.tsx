import HomePage from "app/pages/public/HomePage";
import LoginPage from "app/pages/public/LoginPage";
import NotFoundErrorPage from "app/pages/public/errors/NotFoundErrorPage";
import ServerErrorPage from "app/pages/public/errors/ServerErrorPage";
import PublicErrorsLayout from "app/pages/public/errors/layout/PublicErrorsLayout";
import guestGuard from "core/user/auth/guards/guestGuard/guestGuard";
import SessionStorageService from "core/user/auth/services/sessionStorageService/SessionStorageService";
import RouterManager, { RouterManagerRoute } from "core/routes/RouterManager";
import routesPaths from "core/routes/routesPaths";
import { RouteObject, redirect } from "react-router";

/**
 * get the matching component for the public path
 * @param path
 * @returns
 */
const getPublicPathComponent = (path: string) => {
  switch (path) {
    case routesPaths.HOME:
      return <HomePage />;
    case routesPaths.LOGIN:
      return <LoginPage />;
    case routesPaths.ERROR.NOT_FOUND_RELATIVE:
      return <NotFoundErrorPage />;
    case routesPaths.ERROR.SERVER_ERROR_RELATIVE:
      return <ServerErrorPage />;
  }
};

/**
 * get the public errors routes list
 * @param publicErrorsRouterManager
 * @returns
 */
const getPublicErrorsRoutes = (
  publicErrorsRouterManager: RouterManager<RouterManagerRoute>
): RouteObject[] => {
  return publicErrorsRouterManager.getRoutes().map((route) => ({
    path: route.path,
    element: getPublicPathComponent(route.path),
  }));
};

/**
 * get the public routes list
 * @returns
 */
const getPublicRoutes = (
  publicRouterManager: RouterManager<RouterManagerRoute>,
  publicErrorsRouterManager: RouterManager<RouterManagerRoute>,
  sessionStorageService: SessionStorageService
): RouteObject[] => {
  const publicRoutes: RouteObject[] = publicRouterManager
    .getRoutes()
    .map((route) => ({
      path: route.path,
      ...(route.path === routesPaths.LOGIN && {
        loader: () => {
          if (guestGuard(sessionStorageService)) {
            return null;
          }
          return redirect(`/${routesPaths.DASHBOARD.ROOT}`);
        },
      }),
      element: getPublicPathComponent(route.path),
    }));

  // add errors routes
  publicRoutes.push({
    path: routesPaths.ERROR.ROOT,
    element: <PublicErrorsLayout />,
    children: getPublicErrorsRoutes(publicErrorsRouterManager),
  });

  return publicRoutes;
};

export default getPublicRoutes;
