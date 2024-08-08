import dashboardErrorsRouterManager from './dashboardErrorsRouterManager';

describe('dashboardErrorsRouterManager', () => {
  test('should contain 401 route', () => {
    const routes = dashboardErrorsRouterManager.getRoutes();
    const route = routes.find(route => route.path === '401');
    expect(route).toBeDefined();
  });

  test('should contain 404 route', () => {
    const routes = dashboardErrorsRouterManager.getRoutes();
    const route = routes.find(route => route.path === '404');
    expect(route).toBeDefined();
  });

  test('should contain 500 route', () => {
    const routes = dashboardErrorsRouterManager.getRoutes();
    const route = routes.find(route => route.path === '500');
    expect(route).toBeDefined();
  });
});