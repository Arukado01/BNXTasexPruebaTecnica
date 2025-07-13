import { inject } from '@angular/core';
import {
    CanActivateFn,
    Router,
    UrlTree,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';

export const roleHttpGuard: CanActivateFn = async (): Promise<boolean | UrlTree> => {
    const auth = inject(AuthService);
    const http = inject(HttpClient);
    const router = inject(Router);

    const token = auth.token;
    if (!token) {
        console.warn('[RoleGuard-HTTP] Sin token');
        return router.createUrlTree(['/']);
    }

    try {
        await firstValueFrom(
            http.get<{ ok: boolean }>(
                `${environment.api}/auth/is-admin`,
            ),
        );
        return true;
    } catch (err) {
        console.warn('[RoleGuard-HTTP] No es admin', err);
        return router.createUrlTree(['/']);
    }
};
