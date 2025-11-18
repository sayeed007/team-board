import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import * as AuthActions from '../store/auth.actions';
import { selectAuthLoading, selectAuthError } from '../store/auth.selectors';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="register-container">
      <mat-card class="register-card">
        <mat-card-header>
          <mat-card-title>Create Your Account</mat-card-title>
          <mat-card-subtitle>Start managing your team with TeamBoard</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="full-width">
              <mat-label>Organization Name</mat-label>
              <input matInput type="text" formControlName="organizationName" required />
              <mat-error *ngIf="registerForm.get('organizationName')?.hasError('required')">
                Organization name is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('organizationName')?.hasError('maxlength')">
                Organization name must be less than 100 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Your Full Name</mat-label>
              <input matInput type="text" formControlName="name" required />
              <mat-error *ngIf="registerForm.get('name')?.hasError('required')">
                Name is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('name')?.hasError('maxlength')">
                Name must be less than 100 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Email Address</mat-label>
              <input matInput type="email" formControlName="email" required />
              <mat-error *ngIf="registerForm.get('email')?.hasError('required')">
                Email is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('email')?.hasError('email')">
                Invalid email format
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Password</mat-label>
              <input matInput type="password" formControlName="password" required />
              <mat-error *ngIf="registerForm.get('password')?.hasError('required')">
                Password is required
              </mat-error>
              <mat-error *ngIf="registerForm.get('password')?.hasError('minlength')">
                Password must be at least 6 characters
              </mat-error>
            </mat-form-field>

            <mat-form-field class="full-width">
              <mat-label>Confirm Password</mat-label>
              <input matInput type="password" formControlName="confirmPassword" required />
              <mat-error *ngIf="registerForm.get('confirmPassword')?.hasError('required')">
                Please confirm your password
              </mat-error>
              <mat-error *ngIf="registerForm.hasError('passwordMismatch')">
                Passwords do not match
              </mat-error>
            </mat-form-field>

            <div *ngIf="error$ | async as error" class="error-message">
              {{ error }}
            </div>

            <button
              mat-raised-button
              color="primary"
              type="submit"
              class="full-width"
              [disabled]="registerForm.invalid || (loading$ | async)"
            >
              <span *ngIf="!(loading$ | async)">Create Account</span>
              <mat-spinner *ngIf="loading$ | async" diameter="20"></mat-spinner>
            </button>
          </form>
        </mat-card-content>

        <mat-card-footer>
          <p class="text-center">
            Already have an account? <a routerLink="/auth/login">Sign In</a>
          </p>
        </mat-card-footer>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px 0;
      }

      .register-card {
        width: 100%;
        max-width: 500px;
        margin: 20px;
      }

      mat-form-field {
        margin-bottom: 16px;
      }

      .full-width {
        width: 100%;
      }

      button[type='submit'] {
        margin-top: 16px;
      }

      .text-center {
        text-align: center;
        margin-top: 16px;
      }

      .error-message {
        color: #f44336;
        margin-bottom: 16px;
        padding: 8px;
        background-color: #ffebee;
        border-radius: 4px;
        font-size: 14px;
      }
    `,
  ],
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading$ = this.store.select(selectAuthLoading);
  error$ = this.store.select(selectAuthError);

  constructor(
    private fb: FormBuilder,
    private store: Store,
  ) {
    this.registerForm = this.fb.group(
      {
        organizationName: ['', [Validators.required, Validators.maxLength(100)]],
        name: ['', [Validators.required, Validators.maxLength(100)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      this.store.dispatch(AuthActions.register({ data: registerData }));
    }
  }
}
