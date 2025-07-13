import { Routes } from '@angular/router';
import { roleHttpGuard } from './guards/role-http.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'companies',
    pathMatch: 'full',
  },
  {
    path: 'companies',
    loadComponent: () => import('./pages/company-list/company-list.page').then( m => m.CompanyListPage),
    canActivate: [ roleHttpGuard ],
  },
  {
    path: 'companies/new',
    loadComponent: () => import('./pages/company-create/company-create.page').then( m => m.CompanyCreatePage),
    canActivate: [ roleHttpGuard ],
  },
];
