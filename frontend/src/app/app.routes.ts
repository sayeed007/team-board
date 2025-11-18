import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'boards',
    loadChildren: () => import('./features/boards/boards.routes').then((m) => m.BOARDS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'daily-view',
    loadChildren: () =>
      import('./features/daily-view/daily-view.routes').then((m) => m.DAILY_VIEW_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'reports',
    loadChildren: () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
