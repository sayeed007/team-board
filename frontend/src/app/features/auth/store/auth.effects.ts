import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { ApiService } from '@core/services/api.service';
import { AuthService } from '@core/services/auth.service';
import * as AuthActions from './auth.actions';

@Injectable()
export class AuthEffects {
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ credentials }) =>
        this.apiService.login(credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  register$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.register),
      switchMap(({ data }) =>
        this.apiService.register(data).pipe(
          map((response) => AuthActions.registerSuccess({ response })),
          catchError((error) => of(AuthActions.registerFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess, AuthActions.registerSuccess),
        tap(({ response }) => {
          this.authService.setToken(response.access_token);
          this.router.navigate(['/dashboard']);
        }),
      ),
    { dispatch: false },
  );

  loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.loadUser),
      switchMap(() =>
        this.apiService.getMe().pipe(
          map((user) => AuthActions.loadUserSuccess({ user })),
          catchError((error) => of(AuthActions.loadUserFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.removeToken();
          this.router.navigate(['/auth/login']);
        }),
      ),
    { dispatch: false },
  );

  constructor(
    private actions$: Actions,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}
}
