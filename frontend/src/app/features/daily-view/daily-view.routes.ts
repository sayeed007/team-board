import { Routes } from '@angular/router';

export const DAILY_VIEW_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'my-day',
    pathMatch: 'full',
  },
  {
    path: 'my-day',
    loadComponent: () => import('./my-day/my-day.component').then((m) => m.MyDayComponent),
  },
];
