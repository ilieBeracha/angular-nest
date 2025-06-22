// src/app/routes.ts
import { Routes } from '@angular/router';
import { AuthGuard } from './auth-guard.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth', // Default to home, let the guard handle redirects
    pathMatch: 'full',
  },
  {
    path: 'auth',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/auth/auth.component').then((m) => m.AuthComponent),
  },
  {
    path: 'home',
    canActivate: [AuthGuard],
    loadComponent: () =>
      import('./views/home/home.component').then((m) => m.HomeComponent),
  },
  { path: '**', redirectTo: '404' },
];
