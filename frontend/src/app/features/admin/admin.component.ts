import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  template: `
    <div class="admin-container">
      <h1>Admin Panel</h1>
      <mat-card>
        <mat-card-content>
          <p>Admin panel - Coming soon!</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .admin-container {
        padding: 24px;
      }
    `,
  ],
})
export class AdminComponent {}
