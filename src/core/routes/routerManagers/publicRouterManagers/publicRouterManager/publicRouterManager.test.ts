import publicRouterManager from './publicRouterManager';

describe('publicRouterManager', () => {
  test('should contain HOME route', () => {
    const routes = publicRouterManager.getRoutes();
    const route = routes.find(route => route.path === '/');
    expect(route).toBeDefined();
  });
});