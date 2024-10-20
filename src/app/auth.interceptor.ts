import { HttpEvent, HttpHandlerFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";

const excludedEndpoints: { url: string, method: string }[] = [
  { url: '/login', method: 'POST' },
  { url: '/user', method: 'POST' }
];
export const AuthInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
  const isExcluded = excludedEndpoints.some(endpoint =>
    req.url.includes(endpoint.url) && req.method === endpoint.method
  );

  if (isExcluded) {
    return next(req);
  }

  const token = sessionStorage.getItem('access_token');
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(cloned);
  } else {
    return next(req);
  }
}
