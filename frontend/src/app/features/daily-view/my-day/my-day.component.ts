import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-my-day',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="my-day-container">
      <h1>My Day</h1>
      <mat-card>
        <mat-card-content>
          <p>Daily view feature - Coming soon!</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .my-day-container {
        padding: 24px;
      }
    `,
  ],
})
export class MyDayComponent {}
