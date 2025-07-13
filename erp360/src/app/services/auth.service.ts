import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    /** Token en memoria (y persistido en localStorage) */
    private _token = localStorage.getItem('jwt') || '';

    constructor(private http: HttpClient) { }

    async init(): Promise<void> {
        try {
            const resp = await firstValueFrom(
                this.http.post<{ idToken: string }>(`${environment.api}/auth/login`, {})
            );
            console.log('[AuthService] login OK', resp);
            this.token = resp.idToken;
        } catch (err) {
            console.error('[AuthService] login FAIL', err);
            throw err;
        }
    }

    /* ------------ getter / setter ------------ */
    get token(): string {
        return this._token;
    }
    set token(value: string) {
        this._token = value;
        localStorage.setItem('jwt', value);
    }
}
