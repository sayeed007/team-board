import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { Board, List, Card } from '@shared/models';
import { CardDialogComponent } from '../components/card-dialog/card-dialog.component';
import { ListDialogComponent } from '../components/list-dialog/list-dialog.component';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    DragDropModule,
  ],
  template: \`
    <div class="board-detail-container">
      <!-- Loading State -->
      <div *ngIf="loading" class="loading-state">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading board...</p>
      </div>

      <!-- Board Content -->
      <div *ngIf="!loading && board" class="board-wrapper">
        <!-- Enhanced Header -->
        <header class="board-header">
          <div class="header-left">
            <button mat-icon-button (click)="goBack()" matTooltip="Back to boards">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div class="board-title-section">
              <h1>{{ board.name }}</h1>
              <p class="board-description" *ngIf="board.description">{{ board.description }}</p>
            </div>
          </div>

          <div class="header-actions">
            <button mat-stroked-button color="primary" (click)="addList()">
              <mat-icon>add</mat-icon>
              Add List
            </button>
            <button mat-icon-button [matMenuTriggerFor]="boardMenu" matTooltip="Board settings">
              <mat-icon>more_vert</mat-icon>
            </button>
          </div>
        </header>

        <!-- Board Stats -->
        <div class="board-stats">
          <div class="stat-item">
            <mat-icon>view_week</mat-icon>
            <span>{{ board.lists?.length || 0 }} Lists</span>
          </div>
          <div class="stat-item">
            <mat-icon>credit_card</mat-icon>
            <span>{{ getTotalCards() }} Cards</span>
          </div>
          <div class="stat-item">
            <mat-icon>schedule</mat-icon>
            <span>{{ getActiveCards() }} Active</span>
          </div>
          <div class="stat-item">
            <mat-icon>check_circle</mat-icon>
            <span>{{ getCompletedCards() }} Done</span>
          </div>
        </div>

        <!-- Board Content -->
        <div class="board-content" cdkDropListGroup>
          <!-- Empty State -->
          <div *ngIf="!board.lists || board.lists.length === 0" class="empty-state">
            <mat-icon>view_week</mat-icon>
            <h3>No lists yet</h3>
            <p>Create your first list to start organizing tasks</p>
            <button mat-raised-button color="primary" (click)="addList()">
              <mat-icon>add</mat-icon>
              Create List
            </button>
          </div>

          <!-- Lists -->
          <div
            class="list-container"
            *ngFor="let list of board.lists"
            [id]="list.id"
            [style.background-color]="getListColor(list)"
          >
            <mat-card class="list-card">
              <!-- List Header -->
              <mat-card-header class="list-header">
                <div class="list-title-section">
                  <mat-card-title>{{ list.name }}</mat-card-title>
                  <span class="card-count" [matBadge]="list.cards?.length || 0" matBadgeColor="accent">
                  </span>
                </div>
                <button
                  mat-icon-button
                  [matMenuTriggerFor]="listMenu"
                  class="list-menu-button"
                  matTooltip="List actions"
                >
                  <mat-icon>more_vert</mat-icon>
                </button>

                <!-- List Menu -->
                <mat-menu #listMenu="matMenu">
                  <button mat-menu-item (click)="editList(list)">
                    <mat-icon>edit</mat-icon>
                    <span>Edit List</span>
                  </button>
                  <button mat-menu-item (click)="deleteList(list)">
                    <mat-icon color="warn">delete</mat-icon>
                    <span>Delete List</span>
                  </button>
                </mat-menu>
              </mat-card-header>

              <!-- Cards -->
              <mat-card-content
                cdkDropList
                [cdkDropListData]="list.cards"
                [id]="list.id"
                (cdkDropListDropped)="drop(\$event)"
                class="cards-container"
              >
                <!-- Empty List State -->
                <div *ngIf="!list.cards || list.cards.length === 0" class="empty-list">
                  <p>No cards yet</p>
                </div>

                <!-- Card Items -->
                <div
                  class="card-item"
                  *ngFor="let card of list.cards"
                  cdkDrag
                  (click)="editCard(card, list.id)"
                >
                  <div class="card-content">
                    <!-- Card Header -->
                    <div class="card-header">
                      <h4>{{ card.title }}</h4>
                      <mat-icon class="drag-handle" cdkDragHandle>drag_indicator</mat-icon>
                    </div>

                    <!-- Card Description -->
                    <p *ngIf="card.description" class="card-description">
                      {{ card.description | slice:0:100 }}{{ card.description.length > 100 ? '...' : '' }}
                    </p>

                    <!-- Card Meta -->
                    <div class="card-meta">
                      <span
                        class="priority-badge"
                        [class.priority-low]="card.priority === 'LOW'"
                        [class.priority-medium]="card.priority === 'MEDIUM'"
                        [class.priority-high]="card.priority === 'HIGH'"
                        [class.priority-urgent]="card.priority === 'URGENT'"
                      >
                        {{ card.priority }}
                      </span>

                      <span *ngIf="card.dueDate" class="due-date" [class.overdue]="isOverdue(card.dueDate)">
                        <mat-icon>schedule</mat-icon>
                        {{ formatDate(card.dueDate) }}
                      </span>

                      <span *ngIf="card.assignee" class="assignee" [matTooltip]="card.assignee.name">
                        <mat-icon>person</mat-icon>
                        {{ card.assignee.name | slice:0:10 }}
                      </span>
                    </div>

                    <!-- Card Tags -->
                    <div class="card-tags" *ngIf="card.tags && card.tags.length > 0">
                      <span class="tag" *ngFor="let tag of getCardTags(card)">{{ tag }}</span>
                    </div>

                    <!-- Card Footer -->
                    <div class="card-footer" *ngIf="card.estimatedHours || card.comments">
                      <span *ngIf="card.estimatedHours" class="hours">
                        <mat-icon>timer</mat-icon>
                        {{ card.estimatedHours }}h
                      </span>
                      <span *ngIf="card.comments && card.comments.length > 0" class="comments">
                        <mat-icon>comment</mat-icon>
                        {{ card.comments.length }}
                      </span>
                    </div>
                  </div>

                  <!-- Drag Preview -->
                  <div class="card-drag-preview" *cdkDragPreview>
                    <div class="preview-content">
                      <h4>{{ card.title }}</h4>
                      <span class="priority-badge priority-{{ card.priority.toLowerCase() }}">
                        {{ card.priority }}
                      </span>
                    </div>
                  </div>
                </div>
              </mat-card-content>

              <!-- Add Card Button -->
              <mat-card-actions>
                <button mat-button (click)="addCard(list)" class="add-card-button">
                  <mat-icon>add</mat-icon>
                  Add Card
                </button>
              </mat-card-actions>
            </mat-card>
          </div>

          <!-- Add List Placeholder -->
          <div class="list-container add-list-placeholder" *ngIf="board.lists && board.lists.length > 0">
            <button mat-stroked-button (click)="addList()" class="add-list-button">
              <mat-icon>add</mat-icon>
              Add Another List
            </button>
          </div>
        </div>
      </div>

      <!-- Board Menu -->
      <mat-menu #boardMenu="matMenu">
        <button mat-menu-item (click)="refreshBoard()">
          <mat-icon>refresh</mat-icon>
          <span>Refresh Board</span>
        </button>
        <button mat-menu-item>
          <mat-icon>settings</mat-icon>
          <span>Board Settings</span>
        </button>
        <button mat-menu-item>
          <mat-icon>people</mat-icon>
          <span>Manage Members</span>
        </button>
        <mat-divider></mat-divider>
        <button mat-menu-item (click)="archiveBoard()">
          <mat-icon>archive</mat-icon>
          <span>Archive Board</span>
        </button>
      </mat-menu>
    </div>
  \`,
  styles: [
    \`
      .board-detail-container {
        height: 100%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        position: relative;
      }

      .loading-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        color: white;
      }

      .loading-state p {
        margin-top: 20px;
        font-size: 16px;
      }

      .board-wrapper {
        height: 100%;
        display: flex;
        flex-direction: column;
        padding: 20px;
      }

      .board-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;
        padding: 20px;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(10px);
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1;
      }

      .header-left button {
        color: white;
      }

      .board-title-section h1 {
        margin: 0;
        color: white;
        font-size: 28px;
        font-weight: 600;
      }

      .board-description {
        margin: 4px 0 0 0;
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
      }

      .header-actions {
        display: flex;
        gap: 12px;
      }

      .header-actions button {
        color: white;
        border-color: white;
      }

      .board-stats {
        display: flex;
        gap: 16px;
        margin-bottom: 20px;
        flex-wrap: wrap;
      }

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 20px;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 500;
      }

      .stat-item mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .board-content {
        flex: 1;
        display: flex;
        gap: 20px;
        overflow-x: auto;
        overflow-y: hidden;
        padding-bottom: 20px;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: 100%;
        padding: 60px;
        text-align: center;
        color: white;
      }

      .empty-state mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        margin-bottom: 20px;
        opacity: 0.5;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        font-size: 24px;
      }

      .empty-state p {
        margin: 0 0 24px 0;
        opacity: 0.8;
      }

      .list-container {
        flex: 0 0 340px;
        height: fit-content;
        max-height: calc(100vh - 280px);
      }

      .list-card {
        height: 100%;
        display: flex;
        flex-direction: column;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transition: transform 0.2s;
      }

      .list-card:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
      }

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px;
        border-bottom: 2px solid #f0f0f0;
      }

      .list-title-section {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
      }

      .list-title-section mat-card-title {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
      }

      .card-count {
        display: inline-block;
      }

      .list-menu-button {
        opacity: 0;
        transition: opacity 0.2s;
      }

      .list-card:hover .list-menu-button {
        opacity: 1;
      }

      .cards-container {
        flex: 1;
        overflow-y: auto;
        padding: 12px;
        min-height: 100px;
      }

      .empty-list {
        text-align: center;
        padding: 40px 20px;
        color: #999;
        font-style: italic;
      }

      .card-item {
        background: white;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
        transition: all 0.2s;
        border: 2px solid transparent;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }

      .card-item:hover {
        border-color: #1976d2;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateY(-2px);
      }

      .card-content {
        padding: 14px;
      }

      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
      }

      .card-header h4 {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: #333;
        flex: 1;
        line-height: 1.4;
      }

      .drag-handle {
        opacity: 0;
        transition: opacity 0.2s;
        color: #999;
        font-size: 20px;
        cursor: grab;
      }

      .card-item:hover .drag-handle {
        opacity: 0.6;
      }

      .drag-handle:hover {
        opacity: 1 !important;
      }

      .card-description {
        margin: 0 0 12px 0;
        color: #666;
        font-size: 13px;
        line-height: 1.5;
      }

      .card-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
        margin-bottom: 8px;
      }

      .priority-badge {
        padding: 4px 10px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 700;
        text-transform: uppercase;
      }

      .priority-low {
        background: #e3f2fd;
        color: #1976d2;
      }

      .priority-medium {
        background: #fff3e0;
        color: #f57c00;
      }

      .priority-high {
        background: #fce4ec;
        color: #c2185b;
      }

      .priority-urgent {
        background: #ffebee;
        color: #d32f2f;
      }

      .due-date {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #666;
      }

      .due-date mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .due-date.overdue {
        color: #d32f2f;
        font-weight: 600;
      }

      .assignee {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 12px;
        color: #666;
      }

      .assignee mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .card-tags {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;
        margin-bottom: 8px;
      }

      .tag {
        padding: 3px 8px;
        background: #e0e0e0;
        border-radius: 10px;
        font-size: 11px;
        color: #555;
      }

      .card-footer {
        display: flex;
        gap: 12px;
        align-items: center;
        font-size: 12px;
        color: #666;
      }

      .card-footer span {
        display: flex;
        align-items: center;
        gap: 4px;
      }

      .card-footer mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .add-card-button {
        width: 100%;
        justify-content: flex-start;
        color: #666;
      }

      .add-list-placeholder {
        flex: 0 0 300px;
      }

      .add-list-button {
        width: 100%;
        height: 100%;
        min-height: 100px;
        border: 2px dashed rgba(255, 255, 255, 0.5);
        color: white;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        font-size: 16px;
      }

      .add-list-button:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: white;
      }

      .card-drag-preview {
        background: white;
        border-radius: 8px;
        padding: 14px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        min-width: 300px;
      }

      .preview-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .preview-content h4 {
        margin: 0;
        font-size: 15px;
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
        opacity: 0.9;
      }

      .cdk-drag-placeholder {
        opacity: 0.4;
        border: 2px dashed #1976d2;
        background: #e3f2fd;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .cdk-drop-list-dragging .card-item:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    \`,
  ],
})
export class BoardDetailComponent implements OnInit {
  board: Board | null = null;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
    }
  }

  loadBoard(id: string) {
    this.loading = true;
    this.apiService.getBoard(id).subscribe({
      next: (board) => {
        this.board = board;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading board:', error);
        this.loading = false;
      },
    });
  }

  refreshBoard() {
    if (this.board) {
      this.loadBoard(this.board.id);
    }
  }

  goBack() {
    this.router.navigate(['/boards']);
  }

  getTotalCards(): number {
    if (!this.board?.lists) return 0;
    return this.board.lists.reduce((total, list) => total + (list.cards?.length || 0), 0);
  }

  getActiveCards(): number {
    if (!this.board?.lists) return 0;
    return this.board.lists.reduce(
      (total, list) =>
        total + (list.cards?.filter((c) => c.status !== 'DONE').length || 0),
      0
    );
  }

  getCompletedCards(): number {
    if (!this.board?.lists) return 0;
    return this.board.lists.reduce(
      (total, list) => total + (list.cards?.filter((c) => c.status === 'DONE').length || 0),
      0
    );
  }

  getListColor(list: List): string {
    if (list.settings) {
      const settings = typeof list.settings === 'string'
        ? JSON.parse(list.settings)
        : list.settings;
      return settings.color || 'transparent';
    }
    return 'transparent';
  }

  getCardTags(card: Card): string[] {
    if (!card.tags) return [];
    return Array.isArray(card.tags) ? card.tags : JSON.parse(card.tags as any);
  }

  isOverdue(dueDate: string | Date): boolean {
    return new Date(dueDate) < new Date();
  }

  formatDate(date: string | Date): string {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === tomorrow.toDateString()) return 'Tomorrow';

    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  addList() {
    if (!this.board) return;

    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '500px',
      data: {
        boardId: this.board.id,
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'deleted') {
        this.refreshBoard();
      }
    });
  }

  editList(list: List) {
    if (!this.board) return;

    const dialogRef = this.dialog.open(ListDialogComponent, {
      width: '500px',
      data: {
        list,
        boardId: this.board.id,
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshBoard();
      }
    });
  }

  deleteList(list: List) {
    if (!confirm(\`Delete list "\${list.name}"? This will also delete all cards in this list.\`)) {
      return;
    }

    this.apiService.deleteList(list.id).subscribe({
      next: () => {
        this.refreshBoard();
      },
      error: (error) => {
        console.error('Error deleting list:', error);
        alert('Error deleting list. Please try again.');
      },
    });
  }

  addCard(list: List) {
    if (!this.board) return;

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '700px',
      data: {
        listId: list.id,
        boardId: this.board.id,
        mode: 'create',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result !== 'deleted') {
        this.refreshBoard();
      }
    });
  }

  editCard(card: Card, listId: string) {
    if (!this.board) return;

    const dialogRef = this.dialog.open(CardDialogComponent, {
      width: '700px',
      data: {
        card,
        listId,
        boardId: this.board.id,
        mode: 'edit',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.refreshBoard();
      }
    });
  }

  archiveBoard() {
    if (!this.board) return;

    if (confirm(\`Archive board "\${this.board.name}"?\`)) {
      // Implement archive functionality
      alert('Archive feature coming soon!');
    }
  }

  drop(event: CdkDragDrop<Card[] | undefined>) {
    if (!event.container.data || !event.previousContainer.data) {
      return;
    }

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      const card = event.container.data[event.currentIndex];
      const listId = event.container.id;

      this.apiService.moveCard(card.id, { listId, position: event.currentIndex }).subscribe({
        error: (error) => {
          console.error('Error moving card:', error);
          // Revert on error
          transferArrayItem(
            event.container.data!,
            event.previousContainer.data!,
            event.currentIndex,
            event.previousIndex
          );
        },
      });
    }
  }
}
