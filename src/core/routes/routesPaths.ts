const routesPaths = {
  ROOT: "/",
  HOME: "/",
  LOGIN: "login",
  DASHBOARD: {
    ROOT: "dashboard",
    HOME: "dashboard",
    HOME_RELATIVE: "",
    OTHER: "dashboard/other",
    OTHER_RELATIVE: "other",
    ERROR: {
      ROOT: "dashboard/error",
      ROOT_RELATIVE: "error",
      UNAUTHORIZED: "dashboard/error/401",
      UNAUTHORIZED_RELATIVE: "401",
      NOT_FOUND: "dashboard/error/404",
      NOT_FOUND_RELATIVE: "404",
      SERVER_ERROR: "dashboard/error/500",
      SERVER_ERROR_RELATIVE: "500",
    }
  },
  ERROR: {
    ROOT: 'error',
    NOT_FOUND: "error/404",
    NOT_FOUND_RELATIVE: "404",
    SERVER_ERROR: "error/500",
    SERVER_ERROR_RELATIVE: "500",
  }
};

export default routesPaths;
