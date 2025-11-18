import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { ApiService } from '@core/services/api.service';
import { Board, List, Card } from '@shared/models';

@Component({
  selector: 'app-board-detail',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, DragDropModule],
  template: `
    <div class="board-detail-container" *ngIf="board">
      <header class="board-header">
        <h1>{{ board.name }}</h1>
        <button mat-raised-button color="primary" (click)="addList()">
          <mat-icon>add</mat-icon>
          Add List
        </button>
      </header>

      <div class="board-content" cdkDropListGroup>
        <div class="list-container" *ngFor="let list of board.lists" [id]="list.id">
          <mat-card class="list-card">
            <mat-card-header>
              <mat-card-title>{{ list.name }}</mat-card-title>
              <span class="card-count">{{ list.cards?.length || 0 }}</span>
            </mat-card-header>

            <mat-card-content
              cdkDropList
              [cdkDropListData]="list.cards"
              [id]="list.id"
              (cdkDropListDropped)="drop($event)"
            >
              <div class="card-item" *ngFor="let card of list.cards" cdkDrag>
                <h4>{{ card.title }}</h4>
                <p *ngIf="card.description">{{ card.description }}</p>
                <div class="card-meta">
                  <span class="priority" [class]="'priority-' + card.priority.toLowerCase()">
                    {{ card.priority }}
                  </span>
                  <span *ngIf="card.assignee" class="assignee">{{ card.assignee.name }}</span>
                </div>
              </div>
            </mat-card-content>

            <mat-card-actions>
              <button mat-button (click)="addCard(list)">
                <mat-icon>add</mat-icon>
                Add Card
              </button>
            </mat-card-actions>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .board-detail-container {
        padding: 24px;
        height: 100%;
        overflow-x: auto;
      }

      .board-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 24px;
      }

      .board-content {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        padding-bottom: 16px;
      }

      .list-container {
        flex: 0 0 300px;
      }

      .list-card {
        height: fit-content;
        max-height: calc(100vh - 200px);
        display: flex;
        flex-direction: column;
      }

      .list-card mat-card-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .card-count {
        background: #e0e0e0;
        border-radius: 12px;
        padding: 2px 8px;
        font-size: 12px;
      }

      .list-card mat-card-content {
        flex: 1;
        overflow-y: auto;
        min-height: 100px;
      }

      .card-item {
        background: white;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 12px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;
      }

      .card-item:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      }

      .card-item h4 {
        margin: 0 0 8px 0;
      }

      .card-item p {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 14px;
      }

      .card-meta {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .priority {
        padding: 2px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: bold;
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

      .assignee {
        font-size: 12px;
        color: #666;
      }

      .cdk-drag-preview {
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        opacity: 0.8;
      }

      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .cdk-drop-list-dragging .card-item:not(.cdk-drag-placeholder) {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }
    `,
  ],
})
export class BoardDetailComponent implements OnInit {
  board: Board | null = null;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    const boardId = this.route.snapshot.paramMap.get('id');
    if (boardId) {
      this.loadBoard(boardId);
    }
  }

  loadBoard(id: string) {
    this.apiService.getBoard(id).subscribe((board) => {
      this.board = board;
    });
  }

  addList() {
    const name = prompt('List name:');
    if (name && this.board) {
      this.apiService.createList(this.board.id, { name }).subscribe(() => {
        this.loadBoard(this.board!.id);
      });
    }
  }

  addCard(list: List) {
    const title = prompt('Card title:');
    if (title && this.board) {
      this.apiService.createCard(this.board.id, { title, listId: list.id }).subscribe(() => {
        this.loadBoard(this.board!.id);
      });
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

      this.apiService.moveCard(card.id, { listId, position: event.currentIndex }).subscribe();
    }
  }
}
