import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { Card, CardPriority, CardStatus } from '@shared/models';
import { ApiService } from '@core/services/api.service';

export interface CardDialogData {
  card?: Card;
  listId: string;
  boardId: string;
  mode: 'create' | 'edit';
}

@Component({
  selector: 'app-card-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
  ],
  template: `
    <h2 mat-dialog-title>
      <mat-icon>{{ data.mode === 'create' ? 'add_circle' : 'edit' }}</mat-icon>
      {{ data.mode === 'create' ? 'Create New Card' : 'Edit Card' }}
    </h2>

    <mat-dialog-content>
      <mat-tab-group>
        <!-- Main Tab -->
        <mat-tab label="Details">
          <form [formGroup]="cardForm" class="card-form">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput formControlName="title" placeholder="Enter card title" required />
              <mat-error *ngIf="cardForm.get('title')?.hasError('required')">
                Title is required
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Description</mat-label>
              <textarea
                matInput
                formControlName="description"
                rows="4"
                placeholder="Add a more detailed description..."
              ></textarea>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Priority</mat-label>
                <mat-select formControlName="priority">
                  <mat-option value="LOW">
                    <span class="priority-badge priority-low">Low</span>
                  </mat-option>
                  <mat-option value="MEDIUM">
                    <span class="priority-badge priority-medium">Medium</span>
                  </mat-option>
                  <mat-option value="HIGH">
                    <span class="priority-badge priority-high">High</span>
                  </mat-option>
                  <mat-option value="URGENT">
                    <span class="priority-badge priority-urgent">Urgent</span>
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Status</mat-label>
                <mat-select formControlName="status">
                  <mat-option value="TODO">To Do</mat-option>
                  <mat-option value="IN_PROGRESS">In Progress</mat-option>
                  <mat-option value="IN_REVIEW">In Review</mat-option>
                  <mat-option value="DONE">Done</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Due Date</mat-label>
                <input matInput [matDatepicker]="picker" formControlName="dueDate" />
                <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
              </mat-form-field>

              <mat-form-field appearance="outline" class="half-width">
                <mat-label>Estimated Hours</mat-label>
                <input matInput type="number" formControlName="estimatedHours" min="0" step="0.5" />
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Tags (comma-separated)</mat-label>
              <input matInput formControlName="tagsInput" placeholder="frontend, bug, urgent" />
              <mat-hint>Separate tags with commas</mat-hint>
            </mat-form-field>

            <div class="tags-preview" *ngIf="tags.length > 0">
              <mat-chip-set>
                <mat-chip *ngFor="let tag of tags" [removable]="true" (removed)="removeTag(tag)">
                  {{ tag }}
                  <mat-icon matChipRemove>cancel</mat-icon>
                </mat-chip>
              </mat-chip-set>
            </div>
          </form>
        </mat-tab>

        <!-- Comments Tab (only for edit mode) -->
        <mat-tab label="Comments" *ngIf="data.mode === 'edit' && data.card">
          <div class="comments-section">
            <h3>Comments</h3>
            <p class="no-comments">Comments feature coming soon...</p>
          </div>
        </mat-tab>

        <!-- Activity Tab (only for edit mode) -->
        <mat-tab label="Activity" *ngIf="data.mode === 'edit' && data.card">
          <div class="activity-section">
            <h3>Activity Log</h3>
            <p class="no-activity">Activity log feature coming soon...</p>
          </div>
        </mat-tab>
      </mat-tab-group>
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
        Delete
      </button>
      <button
        mat-raised-button
        color="primary"
        (click)="onSave()"
        [disabled]="!cardForm.valid || saving"
      >
        <mat-icon>{{ saving ? 'hourglass_empty' : 'save' }}</mat-icon>
        {{ saving ? 'Saving...' : data.mode === 'create' ? 'Create' : 'Save' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      mat-dialog-content {
        min-width: 600px;
        max-width: 800px;
        min-height: 400px;
        padding: 24px;
      }

      h2 {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 0;
        color: #1976d2;
      }

      .card-form {
        padding: 20px 0;
      }

      .full-width {
        width: 100%;
        margin-bottom: 16px;
      }

      .form-row {
        display: flex;
        gap: 16px;
        margin-bottom: 16px;
      }

      .half-width {
        flex: 1;
      }

      .priority-badge {
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: 600;
        display: inline-block;
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

      .tags-preview {
        margin: 16px 0;
      }

      .comments-section,
      .activity-section {
        padding: 20px 0;
      }

      .no-comments,
      .no-activity {
        text-align: center;
        color: #999;
        padding: 40px 0;
      }

      .delete-button {
        margin-right: auto !important;
      }

      mat-dialog-actions {
        padding: 16px 24px;
        border-top: 1px solid #e0e0e0;
      }

      ::ng-deep .mat-mdc-tab-body-content {
        overflow: visible !important;
      }
    `,
  ],
})
export class CardDialogComponent {
  cardForm: FormGroup;
  tags: string[] = [];
  saving = false;

  priorities: CardPriority[] = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  statuses: CardStatus[] = ['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    public dialogRef: MatDialogRef<CardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CardDialogData
  ) {
    const card = data.card;

    this.cardForm = this.fb.group({
      title: [card?.title || '', Validators.required],
      description: [card?.description || ''],
      priority: [card?.priority || 'MEDIUM'],
      status: [card?.status || 'TODO'],
      dueDate: [card?.dueDate ? new Date(card.dueDate) : null],
      estimatedHours: [card?.estimatedHours || null],
      tagsInput: [''],
    });

    if (card?.tags) {
      this.tags = Array.isArray(card.tags) ? card.tags : JSON.parse(card.tags as any);
    }

    // Watch tags input for comma separation
    this.cardForm.get('tagsInput')?.valueChanges.subscribe((value: string) => {
      if (value?.includes(',')) {
        const newTags = value
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0);
        this.tags = [...new Set([...this.tags, ...newTags])];
        this.cardForm.patchValue({ tagsInput: '' }, { emitEvent: false });
      }
    });
  }

  removeTag(tag: string) {
    this.tags = this.tags.filter((t) => t !== tag);
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSave() {
    if (!this.cardForm.valid) return;

    this.saving = true;
    const formValue = this.cardForm.value;

    // Add final tag if exists
    if (formValue.tagsInput?.trim()) {
      this.tags.push(formValue.tagsInput.trim());
    }

    const cardData = {
      title: formValue.title,
      description: formValue.description,
      priority: formValue.priority,
      status: formValue.status,
      dueDate: formValue.dueDate ? formValue.dueDate.toISOString() : null,
      estimatedHours: formValue.estimatedHours || null,
      tags: this.tags,
      listId: this.data.listId,
    };

    const request =
      this.data.mode === 'create'
        ? this.apiService.createCard({ ...cardData, listId: this.data.listId })
        : this.apiService.updateCard(this.data.card!.id, cardData);

    request.subscribe({
      next: (result) => {
        this.saving = false;
        this.dialogRef.close(result);
      },
      error: (error) => {
        this.saving = false;
        console.error('Error saving card:', error);
        alert('Error saving card. Please try again.');
      },
    });
  }

  onDelete() {
    if (!confirm('Are you sure you want to delete this card?')) return;

    if (this.data.card) {
      this.apiService.deleteCard(this.data.card.id).subscribe({
        next: () => {
          this.dialogRef.close('deleted');
        },
        error: (error) => {
          console.error('Error deleting card:', error);
          alert('Error deleting card. Please try again.');
        },
      });
    }
  }
}
