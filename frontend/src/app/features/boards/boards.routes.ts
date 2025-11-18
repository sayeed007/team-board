import { Routes } from '@angular/router';

export const BOARDS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./board-list/board-list.component').then((m) => m.BoardListComponent),
  },
  {
    path: ':id',
    loadComponent: () =>
      import('./board-detail/board-detail.component').then((m) => m.BoardDetailComponent),
  },
];
