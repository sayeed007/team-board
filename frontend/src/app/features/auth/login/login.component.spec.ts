import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login.component';
import { AuthActions } from '../store/auth.actions';
import { selectAuthLoading, selectAuthError } from '../store/auth.selectors';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let store: MockStore;

  const initialState = {
    auth: {
      user: null,
      token: null,
      loading: false,
      error: null,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
      ],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    store.overrideSelector(selectAuthLoading, false);
    store.overrideSelector(selectAuthError, null);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with empty values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
  });

  it('should mark email as invalid when empty', () => {
    const emailControl = component.loginForm.get('email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('required')).toBeTruthy();
  });

  it('should mark email as invalid when format is wrong', () => {
    const emailControl = component.loginForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.hasError('email')).toBeTruthy();
  });

  it('should mark password as invalid when empty', () => {
    const passwordControl = component.loginForm.get('password');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('required')).toBeTruthy();
  });

  it('should mark password as invalid when less than 6 characters', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('12345');
    expect(passwordControl?.valid).toBeFalsy();
    expect(passwordControl?.hasError('minlength')).toBeTruthy();
  });

  it('should mark form as valid when all fields are filled correctly', () => {
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should dispatch login action on form submit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123',
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.login({
        credentials: {
          email: 'test@example.com',
          password: 'password123',
        },
      })
    );
  });

  it('should not dispatch login action when form is invalid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.loginForm.patchValue({
      email: 'invalid-email',
      password: '123',
    });

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should display error message when auth error exists', () => {
    store.overrideSelector(selectAuthError, 'Invalid credentials');
    store.refreshState();
    fixture.detectChanges();

    component.error$.subscribe((error) => {
      expect(error).toBe('Invalid credentials');
    });
  });

  it('should show loading state when logging in', () => {
    store.overrideSelector(selectAuthLoading, true);
    store.refreshState();
    fixture.detectChanges();

    component.loading$.subscribe((loading) => {
      expect(loading).toBe(true);
    });
  });
});
