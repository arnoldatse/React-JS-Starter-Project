import { FC, lazy, useContext } from "react";
import {
  createHashRouter,
  redirect,
  RouteObject,
  RouterProvider,
} from "react-router";
import browserPaths from "details/navigation/browser/browserPaths";
import authGuard from "core/authUser/auth/guards/authGuard/authGuard";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";
import MapBrowserPath from "details/navigation/browser/mappers/mapBrowserPath/MapBrowserPath";
import DashboardNavigationLocation from "core/navigation/DashboardNavigationLocation";
import guestGuard from "core/authUser/auth/guards/guestGuard/guestGuard";
import SessionStorageService from "core/authUser/auth/services/sessionStorageService/SessionStorageService";
import AppContext from "../shared/contexts/AppContext";

const PublicLayout = lazy(() => import("app/pages/public/layout/PublicLayout"));
const PublicErrorLayout = lazy(
  () => import("app/pages/public/errors/layout/PublicErrorsLayout")
);
const DashboardLayout = lazy(
  () => import("app/pages/dashboard/layout/DashboardLayout")
);
const DashboardErrorLayout = lazy(
  () => import("app/pages/dashboard/errors/layout/DashboardErrorsLayout")
);

//Public pages components
const HomePage = lazy(
  () => import("app/pages/public/pages/homePage/HomePage")
);
const LoginPage = lazy(
  () => import("app/pages/public/pages/loginPage/LoginPage")
);

//Dashboard pages components
const DashboardPage = lazy(
  () => import("app/pages/dashboard/pages/dashboardPage/DashboardPage")
);
const CustomPage = lazy(
  () => import("app/pages/dashboard/pages/otherPage/OtherPage")
);

const Router: FC = () => {
  const sessionStorageService: SessionStorageService =
    useContext(AppContext).sessionStorageService;

  const mapPublicNavigationLocationToComponent = (
    publicNavigationLocation: PublicNavigationLocation
  ) => {
    switch (publicNavigationLocation) {
      case PublicNavigationLocation.HOME:
        return <HomePage />;
      case PublicNavigationLocation.LOGIN:
        return <LoginPage />;
    }
  };

  const mapDashboardNavigationLocationToComponent = (
    dashboardNavigationLocation: DashboardNavigationLocation
  ) => {
    switch (dashboardNavigationLocation) {
      case DashboardNavigationLocation.DASHBOARD:
        return <DashboardPage />;
      case DashboardNavigationLocation.OTHER:
        return <CustomPage />;
    }
  };

  const publicRoutes: RouteObject[] = Object.keys(PublicNavigationLocation)
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      path: MapBrowserPath.mapToBrowserPath(key as PublicNavigationLocation),
      element: mapPublicNavigationLocationToComponent(
        key as PublicNavigationLocation
      ),
      ...(key === PublicNavigationLocation.LOGIN && {
        loader: () =>
          guestGuard(sessionStorageService)
            ? null
            : redirect(`/${browserPaths.DASHBOARD.HOME}`),
      }),
    }));

  const dashboardRoutes: RouteObject[] = Object.keys(
    DashboardNavigationLocation
  )
    .filter((key) => isNaN(Number(key)))
    .map((key) => ({
      path: MapBrowserPath.mapToBrowserRelativePath(
        key as DashboardNavigationLocation
      ),
      element: mapDashboardNavigationLocationToComponent(
        key as DashboardNavigationLocation
      ),
    }));

  const routes: RouteObject[] = [
    {
      path: browserPaths.HOME,
      element: <PublicLayout />,
      children: [
        ...publicRoutes,
        {
          path: browserPaths.ERROR.ROOT_RELATIVE,
          element: <PublicErrorLayout />,
          children: [
            {
              path: browserPaths.ERROR.NOT_FOUND_RELATIVE,
              element: <div>Not Found</div>,
            },
          ],
        },
      ],
    },
    {
      path: browserPaths.DASHBOARD.ROOT,
      element: <DashboardLayout />,
      loader: () =>
        authGuard(sessionStorageService) ? null : redirect(browserPaths.HOME),
      children: [
        ...dashboardRoutes,
        {
          path: browserPaths.DASHBOARD.ERROR.ROOT_RELATIVE,
          element: <DashboardErrorLayout />,
          children: [
            {
              path: browserPaths.DASHBOARD.ERROR.NOT_FOUND_RELATIVE,
              element: <div>Not Found</div>,
            },
          ],
        },
      ],
    },

    //Note found redirect
    {
      path: `${browserPaths.DASHBOARD.ROOT}/*`,
      loader: () => redirect(`/${browserPaths.DASHBOARD.ERROR.NOT_FOUND}`),
    },
    {
      path: "*",
      loader: () => redirect(`/${browserPaths.ERROR.NOT_FOUND}`),
    },
  ];

  console.log('Router initialized with routes:', routes);

  const router = createHashRouter(routes);

  return <RouterProvider router={router} />;
};

export default Router;
