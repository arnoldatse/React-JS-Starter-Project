import Permissions from "core/user/auth/entities/Permissions";

export interface RouterManagerRoute {
    path: string;
    permission?: Permissions
}

export default class RouterManager<T extends RouterManagerRoute> {
    private routes: T[] = [];
    private firstRouteAppPath = "";
    private routeNotFoundErrorMessage = `Route not found`;

    constructor(routes: T[] = []) {
        this.setRoutes(routes);
    }

    setRoutes(routes: T[]) {
        this.routes = [...routes];
    }

    addRoutes(routes: T[]) {
        routes.forEach(route => this.addRoute(route));
    }

    addRoute(route: T) {
        try {
            const indexToUpdate = this.findRouteIndexByPath(route.path);
            this.routes[indexToUpdate] = route;
        } catch (e) {
            const error = e as Error;
            if (error.message === this.routeNotFoundErrorMessage) {
                this.routes.push(route);
            }
        }
    }

    updateRoutePath(oldPath: string, newPath: string) {
        try {
            const indexToUpdate = this.findRouteIndexByPath(oldPath);
            this.routes[indexToUpdate].path = newPath;
        } catch (e) {
            throw new Error(`Route with path ${oldPath} not found`);
        }
    }

    updateRouteIndexPath(index: number, newPath: string) {
        if (index < 0 || index >= this.routes.length) {
            throw new Error(`Index ${index} out of range`);
        }
        this.routes[index].path = newPath;
    }
    
    updateRouteByPath(path: string, newPath: string) {
        try {
            const indexToUpdate = this.findRouteIndexByPath(path);
            this.routes[indexToUpdate].path = newPath;
        } catch (e) {
            throw new Error(`Route with path ${path} not found`);
        }
    }

    removeRoute(path: string) {
        try {
            const indexToRemove = this.findRouteIndexByPath(path);
            this.routes.splice(indexToRemove, 1);
        } catch (e) {
            throw new Error(`Route with path ${path} not found`);
        }
    }

    getRoutes() {
        return this.routes;
    }

    findRouteIndexByPath(path: string) {
        const index = this.routes.findIndex(route => route.path === path);
        if (index === -1) {
            throw new Error(this.routeNotFoundErrorMessage);
        }
        return index;
    }

    setFirstRouteAppPath(path: string) {
        try {
            this.findRouteIndexByPath(path);
            this.firstRouteAppPath = path;
        }
        catch (e) {
            throw new Error(this.routeNotFoundErrorMessage);
        }
    }

    getFirstRouteAppPath() {
        return this.firstRouteAppPath;
    }

    static updatePathVariable(path: string, variable: string, value: string) {
        return path.replace(`:${variable}`, value);
    }
}