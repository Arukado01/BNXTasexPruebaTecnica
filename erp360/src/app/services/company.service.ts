import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/company.model';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class CompanyService {
    private apiUrl = environment.api;

    constructor(private http: HttpClient) { }

    list() {
        return this.http.get<Company[]>(`${this.apiUrl}/companies`);
    }

    create(payload: {
        name: string;
        nit: string;
        emailAdmin: string;
        password: string;
    }) {
        return this.http.post(`${this.apiUrl}/companies`, payload);
    }
}
