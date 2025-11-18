import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { ApiService } from '@core/services/api.service';
import { Board } from '@shared/models';

@Component({
  selector: 'app-board-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="board-list-container">
      <header class="page-header">
        <h1>My Boards</h1>
        <button mat-raised-button color="primary" (click)="createBoard()">
          <mat-icon>add</mat-icon>
          Create Board
        </button>
      </header>

      <div class="boards-grid">
        <mat-card *ngFor="let board of boards" class="board-card" (click)="openBoard(board.id)">
          <mat-card-header>
            <mat-card-title>{{ board.name }}</mat-card-title>
            <mat-card-subtitle>{{ board.team?.name || 'No team' }}</mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <p>{{ board.description || 'No description' }}</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="create-board-card" (click)="createBoard()">
          <mat-icon>add_circle_outline</mat-icon>
          <p>Create new board</p>
        </mat-card>
      </div>
    </div>
  `,
  styles: [
    `
      .board-list-container {
        padding: 24px;
        max-width: 1200px;
        margin: 0 auto;
      }

      .page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .boards-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 16px;
      }

      .board-card,
      .create-board-card {
        cursor: pointer;
        transition: all 0.3s;
      }

      .board-card:hover,
      .create-board-card:hover {
        box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        transform: translateY(-4px);
      }

      .create-board-card {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 150px;
        border: 2px dashed #ccc;
      }

      .create-board-card mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #999;
      }

      .create-board-card p {
        color: #999;
      }
    `,
  ],
})
export class BoardListComponent implements OnInit {
  boards: Board[] = [];

  constructor(
    private apiService: ApiService,
    private router: Router,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadBoards();
  }

  loadBoards() {
    this.apiService.getBoards().subscribe((boards) => {
      this.boards = boards;
    });
  }

  openBoard(id: string) {
    this.router.navigate(['/boards', id]);
  }

  createBoard() {
    // TODO: Open create board dialog
    const name = prompt('Board name:');
    if (name) {
      this.apiService.createBoard({ name }).subscribe(() => {
        this.loadBoards();
      });
    }
  }
}
