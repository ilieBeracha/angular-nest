import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../../../services/authService';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, FormsModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  standalone: true,
})
export class AuthComponent {
  authService = inject(AuthService);
  email = '';
  password = '';

  loginMutation = injectMutation(() => ({
    mutationFn: (credentials: { email: string; password: string }) =>
      lastValueFrom(
        this.authService.login(credentials.email, credentials.password)
      ),
  }));

  onSubmitForm() {
    this.loginMutation.mutate({ email: this.email, password: this.password });
  }
}
