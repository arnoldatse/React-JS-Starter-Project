import publicErrorsRouterManager from './publicErrorsRouterManager';

describe('publicErrorsRouterManager', () => {
  test('should contain 404 route', () => {
    const routes = publicErrorsRouterManager.getRoutes();
    const route = routes.find(route => route.path === '404');
    expect(route).toBeDefined();
  });

  test('should contain 500 route', () => {
    const routes = publicErrorsRouterManager.getRoutes();
    const route = routes.find(route => route.path === '500');
    expect(route).toBeDefined();
  });
});