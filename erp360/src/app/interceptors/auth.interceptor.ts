import { Injectable } from '@angular/core';
import {
    HttpEvent,
    HttpHandler,
    HttpInterceptor,
    HttpRequest,
    HttpHeaders,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) { }

    intercept(
        req: HttpRequest<unknown>,
        next: HttpHandler,
    ): Observable<HttpEvent<unknown>> {
        const token = this.auth.token;
        if (!token) {
            console.warn('[AuthInterceptor] no token, skipping header');
            return next.handle(req);
        }
        console.debug('[AuthInterceptor] adding token');


        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
        });
        return next.handle(req.clone({ headers }));
    }
}
