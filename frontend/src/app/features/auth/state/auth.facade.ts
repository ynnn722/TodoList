import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { AuthApiService } from '../services/auth-api.service';
import { LoginRequest } from '../auth.types';

@Injectable({
  providedIn: 'root'
})
export class AuthFacade {
  private readonly api = inject(AuthApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  readonly isAuthenticated = signal(false);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  login(request: LoginRequest): void {
    if (this.loading()) return;
    this.loading.set(true);
    this.error.set(null);
    this.api
      .login(request)
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (response) => {
          if (response?.success === true) {
            this.isAuthenticated.set(true);
            this.snackBar.open('로그인에 성공했습니다.', '닫기', { duration: 1500 });
            this.router.navigate(['/']);
          } else {
            this.isAuthenticated.set(false);
            this.error.set('아이디 또는 비밀번호가 올바르지 않습니다.');
            this.snackBar.open('로그인에 실패했습니다.', '닫기', { duration: 2000 });
          }
        },
        error: () => {
          this.isAuthenticated.set(false);
          this.error.set('로그인 요청 중 오류가 발생했습니다.');
          this.snackBar.open('로그인 요청에 실패했습니다.', '닫기', { duration: 2000 });
        }
      });
  }

  logout(): void {
    this.isAuthenticated.set(false);
    this.error.set(null);
    this.router.navigate(['/login']);
  }
}
