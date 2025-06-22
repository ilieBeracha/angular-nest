import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { tap } from 'rxjs';

interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  protected router = inject(Router);
  protected BASE_URL = 'http://localhost:8000';
  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http
      .post<AuthResponse>(`${this.BASE_URL}/auth/login`, {
        email,
        password,
      })
      .pipe(
        tap((response) =>
          this.setUser({
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
          })
        )
      );
  }

  setUser(tokens: { accessToken: string; refreshToken: string }) {
    localStorage.setItem('access', tokens.accessToken);
    localStorage.setItem('refresh', tokens.refreshToken);
    this.router.navigate(['/home']);
  }
}
