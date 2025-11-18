import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { List } from '@shared/models';
import { ApiService } from '@core/services/api.service';

export interface ListDialogData {
  list?: List;
  boardId: string;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-list-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ data.mode === 'create' ? 'add_circle' : 'edit' }}</mat-icon>
      {{ data.mode === 'create' ? 'Create New List' : 'Edit List' }}
    </h2>

    <mat-dialog-content>
      <form [formGroup]="listForm" class="list-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>List Name</mat-label>
          <input
            matInput
            formControlName="name"
            placeholder="e.g., To Do, In Progress, Done"
            required
            autofocus
          />
          <mat-error *ngIf="listForm.get('name')?.hasError('required')">
            List name is required
          </mat-error>
          <mat-error *ngIf="listForm.get('name')?.hasError('minlength')">
            List name must be at least 2 characters
          </mat-error>
        </mat-form-field>

        <div class="color-picker">
          <label>List Color (optional)</label>
          <div class="colors">
            <div
              *ngFor="let color of colors"
              class="color-option"
              [class.selected]="selectedColor === color.value"
              [style.background-color]="color.value"
              (click)="selectedColor = color.value"
              [title]="color.name"
            ></div>
          </div>
        </div>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button
        mat-button
        color="warn"
        *ngIf="data.mode === 'edit'"
        (click)="onDelete()"
        class="delete-button"
      >
        <mat-icon>delete</mat-icon>
        Delete List
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="!listForm.valid || saving"
      >
        <mat-icon>{{ saving ? 'hourglass_empty' : 'save' }}</mat-icon>
        {{ saving ? 'Saving...' : data.mode === 'create' ? 'Create' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 400px;
        padding: 24px;
      }

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        color: #1976d2;
      }

      .list-form {
        padding: 20px 0;
      }

      .full-width {
        width: 100%;
      }

      .color-picker {
        margin-top: 20px;
      }

      .color-picker label {
        display: block;
        margin-bottom: 12px;
        color: rgba(0, 0, 0, 0.6);
        font-size: 14px;
      }

      .colors {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
      }

      .color-option {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.2s;
        border: 3px solid transparent;
      }

      .color-option:hover {
        transform: scale(1.1);
      }

      .color-option.selected {
        border-color: #1976d2;
        box-shadow:
          0 0 0 2px white,
          0 0 0 4px #1976d2;
      }

      .delete-button {
        margin-right: auto !important;
      }

      mat-dialog-actions {
        padding: 16px 24px;
        border-top: 1px solid #e0e0e0;
      }
    `,
  ],
})
export class ListDialogComponent {
  listForm: FormGroup;
  saving = false;
  selectedColor: string | null = null;

  colors = [
    { name: 'Blue', value: '#e3f2fd' },
    { name: 'Green', value: '#e8f5e9' },
    { name: 'Yellow', value: '#fff9c4' },
    { name: 'Orange', value: '#fff3e0' },
    { name: 'Red', value: '#ffebee' },
    { name: 'Purple', value: '#f3e5f5' },
    { name: 'Pink', value: '#fce4ec' },
    { name: 'Cyan', value: '#e0f7fa' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ListDialogData
  ) {
    this.listForm = this.fb.group({
      name: [data.list?.name || '', [Validators.required, Validators.minLength(2)]],
    });

    if (data.list?.settings) {
      const settings =
        typeof data.list.settings === 'string'
          ? JSON.parse(data.list.settings)
          : data.list.settings;
      this.selectedColor = settings.color || null;
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.listForm.valid) return;

    this.saving = true;
    const listData = {
      name: this.listForm.value.name,
      boardId: this.data.boardId,
      settings: this.selectedColor ? { color: this.selectedColor } : {},
    };

    const request =
      this.data.mode === 'create'
        ? this.apiService.createList(this.data.boardId, listData)
        : this.apiService.updateList(this.data.list!.id, listData);

    request.subscribe({
      next: (result) => {
        this.saving = false;
        this.dialogRef.close(result);
      },
      error: (error) => {
        this.saving = false;
        console.error('Error saving list:', error);
        alert('Error saving list. Please try again.');
      },
    });
  }

  onDelete() {
    if (!this.data.list) return;

    const cardCount = this.data.list.cards?.length || 0;
    const message =
      cardCount > 0
        ? `This list contains ${cardCount} card(s). Are you sure you want to delete it? All cards will be deleted.`
        : 'Are you sure you want to delete this list?';

    if (!confirm(message)) return;

    this.apiService.deleteList(this.data.list.id).subscribe({
      next: () => {
        this.dialogRef.close('deleted');
      },
      error: (error) => {
        console.error('Error deleting list:', error);
        alert('Error deleting list. Please try again.');
      },
    });
  }
}
