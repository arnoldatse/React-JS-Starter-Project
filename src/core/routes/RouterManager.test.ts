import RouterManager, { RouterManagerRoute } from './RouterManager';
import Permissions from 'core/user/auth/entities/Permissions';

interface TestRoute extends RouterManagerRoute {
    path: string;
    permission?: Permissions;
}

describe('RouterManager', () => {
    let routerManager: RouterManager<TestRoute>;

    beforeEach(() => {
        routerManager = new RouterManager<TestRoute>();
    });

    test('should set routes', () => {
        const routes: TestRoute[] = [{ path: '/home' }, { path: '/about' }];
        routerManager.setRoutes(routes);
        expect(routerManager.getRoutes()).toEqual(routes);
    });

    test('should add routes', () => {
        const routes: TestRoute[] = [{ path: '/home' }, { path: '/about' }];
        routerManager.addRoutes(routes);
        expect(routerManager.getRoutes()).toEqual(routes);
    });

    test('should add routes and update existing route', () => {
        const routes: TestRoute[] = [{ path: '/home' }, { path: '/about' }];
        routerManager.setRoutes(routes);
        const newRoutes: TestRoute[] = [{ path: '/home', permission: Permissions.ADMINISTRATION }, { path: '/contact' }];
        routerManager.addRoutes(newRoutes);
        expect(routerManager.getRoutes()).toEqual([{ path: '/home', permission: Permissions.ADMINISTRATION }, { path: '/about' }, { path: '/contact' }]);
    });

    test('should add a route', () => {
        const route: TestRoute = { path: '/contact' };
        routerManager.addRoute(route);
        expect(routerManager.getRoutes()).toContain(route);
    });

    test('should add a route and update existing route', () => {
        const routes: TestRoute[] = [{ path: '/home' }, { path: '/about' }];
        routerManager.setRoutes(routes);
        const route: TestRoute = { path: '/home', permission: Permissions.ADMINISTRATION };
        routerManager.addRoute(route);
        expect(routerManager.getRoutes()).toEqual([{ path: '/home', permission: Permissions.ADMINISTRATION }, { path: '/about' }]);
    });

    test('should update a route path', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        routerManager.updateRoutePath('/home', '/dashboard');
        expect(routerManager.getRoutes()[0].path).toBe('/dashboard');
    });

    test('should throw error when updating non-existent route path', () => {
        expect(() => routerManager.updateRoutePath('/nonexistent', '/newpath')).toThrow('Route with path /nonexistent not found');
    });

    test('should update a route path by index', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        routerManager.updateRouteIndexPath(0, '/dashboard');
        expect(routerManager.getRoutes()[0].path).toBe('/dashboard');
    });

    test('should throw error when updating route path by invalid index', () => {
        expect(() => routerManager.updateRouteIndexPath(1, '/newpath')).toThrow('Index 1 out of range');
    });

    test('should update a route by path', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        routerManager.updateRouteByPath('/home', '/dashboard');
        expect(routerManager.getRoutes()[0].path).toBe('/dashboard');
    });

    test('should throw error when updating non-existent route', () => {
        expect(() => routerManager.updateRouteByPath('/nonexistent', '/newpath')).toThrow('Route with path /nonexistent not found');
    });

    test('should remove a route', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        routerManager.removeRoute('/home');
        expect(routerManager.getRoutes()).toHaveLength(0);
    });

    test('should throw error when removing non-existent route', () => {
        expect(() => routerManager.removeRoute('/nonexistent')).toThrow('Route with path /nonexistent not found');
    });

    test('should find route index by path', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        expect(routerManager.findRouteIndexByPath('/home')).toBe(0);
    });

    test('should set and get the first route app path', () => {
        const routes: TestRoute[] = [{ path: '/home' }];
        routerManager.setRoutes(routes);
        routerManager.setFirstRouteAppPath('/home');
        expect(routerManager.getFirstRouteAppPath()).toBe('/home');
    });

    test('should throw error when setting non-existent first route app path', () => {
        expect(() => routerManager.setFirstRouteAppPath('/nonexistent')).toThrow('Route not found');
    });

    test('should update path variable', ()=>{
        expect(RouterManager.updatePathVariable('/user/:id', 'id', '{id}')).toBe('/user/{id}');
    });
});