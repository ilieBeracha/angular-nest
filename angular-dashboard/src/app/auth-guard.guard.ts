// src/app/auth-guard.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const AuthGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const accessToken = localStorage.getItem('access');

  if (accessToken) {
    // If trying to access login page while authenticated, redirect to home
    if (state.url.includes('/auth')) {
      router.navigate(['/home']);
      return false;
    }
    return true; // Authorized
  } else {
    // If not authenticated and not on the login page, redirect to login
    if (!state.url.includes('/auth')) {
      router.navigate(['/auth']);
      return false;
    }
    return true; // Allow access to login page
  }
};
