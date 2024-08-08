import dashboardRouterManager from './dashboardRouterManager';

describe('dashboardRouterManager', () => {
  test('should contain HOME route', () => {
    const routes = dashboardRouterManager.getRoutes();
    const route = routes.find(route => route.path === '');
    expect(route).toBeDefined();
  });

  test('should contain OTHER route', () => {
    const routes = dashboardRouterManager.getRoutes();
    const route = routes.find(route => route.path === 'other');
    expect(route).toBeDefined();
  });
});