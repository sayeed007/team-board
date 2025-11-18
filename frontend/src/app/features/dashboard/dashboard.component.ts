import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApiService } from '@core/services/api.service';
import { Board, User } from '@shared/models';
import { selectUser } from '../auth/store/auth.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  template: `
    <div class="dashboard-container">
      <header class="dashboard-header">
        <h1>Welcome back, {{ (user$ | async)?.name }}!</h1>
        <button mat-raised-button color="primary" routerLink="/boards">
          <mat-icon>dashboard</mat-icon>
          View All Boards
        </button>
      </header>

      <div class="dashboard-content">
        <div class="stats-grid">
          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon>assignment</mat-icon>
              <mat-card-title>My Boards</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">{{ (boards$ | async)?.length || 0 }}</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon>task_alt</mat-icon>
              <mat-card-title>Active Tasks</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">0</div>
            </mat-card-content>
          </mat-card>

          <mat-card class="stat-card">
            <mat-card-header>
              <mat-icon>today</mat-icon>
              <mat-card-title>Due Today</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="stat-value">0</div>
            </mat-card-content>
          </mat-card>
        </div>

        <mat-card class="recent-boards">
          <mat-card-header>
            <mat-card-title>Recent Boards</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="loading" class="loading-spinner">
              <mat-spinner></mat-spinner>
            </div>

            <div *ngIf="!loading && (boards$ | async) as boards" class="boards-list">
              <div
                *ngFor="let board of boards"
                class="board-item"
                [routerLink]="['/boards', board.id]"
              >
                <h3>{{ board.name }}</h3>
                <p>{{ board.description }}</p>
              </div>

              <div *ngIf="boards.length === 0" class="empty-state">
                <p>No boards yet. Create your first board to get started!</p>
                <button mat-raised-button color="primary" routerLink="/boards">Create Board</button>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .dashboard-header h1 {
        margin: 0;
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        margin-bottom: 24px;
      }

      .stat-card mat-card-header {
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .stat-value {
        font-size: 48px;
        font-weight: bold;
        color: #3f51b5;
      }

      .boards-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }

      .board-item {
        padding: 16px;
        border: 1px solid #ddd;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
      }

      .board-item:hover {
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-2px);
      }

      .board-item h3 {
        margin: 0 0 8px 0;
      }

      .board-item p {
        margin: 0;
        color: #666;
      }

      .empty-state {
        text-align: center;
        padding: 48px 24px;
      }

      .loading-spinner {
        display: flex;
        justify-content: center;
        padding: 48px;
      }
    `,
  ],
})
export class DashboardComponent implements OnInit {
  user$ = this.store.select(selectUser);
  boards$!: Observable<Board[]>;
  loading = true;

  constructor(
    private store: Store,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.boards$ = this.apiService.getBoards();
    this.boards$.subscribe(() => (this.loading = false));
  }
}
