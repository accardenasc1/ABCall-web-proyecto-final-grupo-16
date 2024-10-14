import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private excludedEndpoints: { url: string, method: string }[] = [
    { url: '/login', method: 'POST' },
    { url: '/user', method: 'POST' }
  ];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const isExcluded = this.excludedEndpoints.some(endpoint => 
      req.url.includes(endpoint.url) && req.method === endpoint.method
    );

    if (isExcluded) {
      return next.handle(req);
    }

    const token = sessionStorage.getItem('access_token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {
      return next.handle(req);
    }
  }
}