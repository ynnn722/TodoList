import { Component, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthFacade } from '../../state/auth.facade';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatSnackBarModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private readonly authFacade = inject(AuthFacade);

  readonly loading = this.authFacade.loading;
  readonly error = this.authFacade.error;
  readonly passwordVisible = signal(false);
  readonly capsLockOn = signal(false);

  readonly form = new FormGroup({
    userId: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(64)]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(128)]
    })
  });

  constructor() {
    effect(() => this.loading() ? this.form.disable({ emitEvent: false }) : this.form.enable({ emitEvent: false }));
  }

  get userId(): FormControl<string> { return this.form.controls.userId; }
  get password(): FormControl<string> { return this.form.controls.password; }

  togglePasswordVisibility(): void {
    this.passwordVisible.update((v) => !v);
  }

  onPasswordKey(event: KeyboardEvent): void {
    this.capsLockOn.set(event.getModifierState?.('CapsLock') ?? false);
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    const { userId, password } = this.form.getRawValue();
    this.authFacade.login({ userId: userId.trim(), password });
  }
}