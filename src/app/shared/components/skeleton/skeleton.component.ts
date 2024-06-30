import { Component } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  template: `
    <div class="skeleton">
      <div *ngFor="let item of items" class="skeleton-item"></div>
    </div>
  `,
  styleUrls: ['./skeleton.component.css']
})
export class SkeletonComponent {
  items = Array(5);
}
