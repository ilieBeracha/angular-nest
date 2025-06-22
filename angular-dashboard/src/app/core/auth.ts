import { computed, inject, signal } from '@angular/core';
import { AuthService } from '../../services/authService';
import { User } from '../../types/user';
import { tap } from 'rxjs';
import { Router } from '@angular/router';

export class Auth {
  private authService = inject(AuthService);
  private router = inject(Router);
  private user = signal<User | null>(null);
  private accessToken = signal<string | null>(localStorage.getItem('access'));

  isLoading = signal(false);

  login(email: string, password: string) {
    this.authService
      .login(email, password)
      .pipe(
        tap((response) => {
          this.isLoading.set(true);
          this.user.set(response.user);
          this.setTokens(response.access_token, response.refresh_token);
        })
      )
      .subscribe({
        next: () => {
          console.log('login success');
          this.router.navigate(['/dashboard'], { replaceUrl: true });
        },
        error: (error) => {
          console.error(error);
        },
        complete: () => {
          this.isLoading.set(false);
        },
      });
  }

  setTokens(accessToken: string, refreshToken: string) {
    this.accessToken.set(accessToken);
    localStorage.setItem('access', accessToken);
    localStorage.setItem('refresh', refreshToken);
  }

  isAuthenticated = computed(() => !!this.accessToken());
}
