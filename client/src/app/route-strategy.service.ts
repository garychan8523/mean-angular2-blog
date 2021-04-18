import { Injectable } from '@angular/core';
import { RouteReuseStrategy, DetachedRouteHandle, ActivatedRouteSnapshot } from '@angular/router';
import { EventEmitterService } from './services/event-emitter.service';

@Injectable()
export class RouteStrategyService implements RouteReuseStrategy {
    constructor(private eventEmitterService: EventEmitterService) { }

    public static handlers: { [key: string]: DetachedRouteHandle } = {};
    public static deleteRouteSnapshot(path: string): void {
        const name = path.replace(/\//g, '_');
        if (RouteStrategyService.handlers[name]) {
            delete RouteStrategyService.handlers[name];
        }
    }
    /**
     * determine whether the current route need to be cached
     * if false returned  then other function will be called
     * @param {ActivatedRouteSnapshot} future
     * @param {ActivatedRouteSnapshot} curr
     * @returns {boolean}
     * @memberof CacheRouteReuseStrategy
     */
    public shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
        //return future.routeConfig === curr.routeConfig && JSON.stringify(future.params) === JSON.stringify(curr.params);
        return future.data.shouldReuse || false;
    }
    /**
     * called when exit from current route
     * if true returned then store function will be called
     * @param {ActivatedRouteSnapshot} route
     * @returns {boolean}
     * @memberof CacheRouteReuseStrategy
     */
    public shouldDetach(route: ActivatedRouteSnapshot): boolean {
        return route.data.shouldReuse || false;
    }
    /**
     * writing route into cache
     * where implement cache of RouteHandle
     * provided our exit route and RouteHandle
     * @param {ActivatedRouteSnapshot} route
     * @param {DetachedRouteHandle} detachedTree
     * @memberof CacheRouteReuseStrategy
     */
    public store(route: ActivatedRouteSnapshot, detachedTree: DetachedRouteHandle): void {
        if (route.data.shouldReuse) {
            RouteStrategyService.handlers[this.getPath(route)] = detachedTree;
        }
    }
    /**
     * if route need to be reuse then return true and trigger retrieve function
     * if false was returned then the component will be rebuild
     * @param {ActivatedRouteSnapshot} route
     * @returns {boolean}
     * @memberof CacheRouteReuseStrategy
     */
    public shouldAttach(route: ActivatedRouteSnapshot): boolean {
        if (route.data.showNavbar) {
            this.eventEmitterService.updateNavbarStatus('show');
        }
        return !!route.routeConfig && !!RouteStrategyService.handlers[this.getPath(route)];
    }
    /**
     * read cached route
     * provide param of current route (just opened) and return the cached RouteHandle
     * can be used for acquiring cached RouteHandle
     * @param {ActivatedRouteSnapshot} route
     * @returns {(DetachedRouteHandle | null)}
     * @memberof CacheRouteReuseStrategy
     */
    public retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
        if (!route.routeConfig) return null;
        return RouteStrategyService.handlers[this.getPath(route)] || null;
    }
    private getPath(route: ActivatedRouteSnapshot): string {
        // tslint:disable-next-line: no-string-literal
        const path = route['_routerState'].url.replace(/\//g, '_');
        return path;
    }
}