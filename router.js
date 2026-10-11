export class Router {
  constructor() {
    this.routes = []; // { method, segments, handler }
  }

  _add(method, path, handler) {
    const segments = path.split('/').filter(Boolean);
    this.routes.push({ method, segments, handler });
  }

  get(path, handler) {
    this._add('GET', path, handler);
  }

  post(path, handler) {
    this._add('POST', path, handler);
  }

  // Matches an incoming method + pathname against registered routes,
  // returning { handler, params } or null.
  match(method, pathname) {
    const segments = pathname.split('/').filter(Boolean);
    for (const route of this.routes) {
      if (route.method !== method) continue;
      if (route.segments.length !== segments.length) continue;
      const params = {};
      let ok = true;
      for (let i = 0; i < segments.length; i++) {
        const routeSeg = route.segments[i];
        const actualSeg = segments[i];
        if (routeSeg.startsWith(':')) {
          params[routeSeg.slice(1)] = decodeURIComponent(actualSeg);
        } else if (routeSeg !== actualSeg) {
          ok = false;
          break;
        }
      }
      if (ok) return { handler: route.handler, params };
    }
    return null;
  }
}
