import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductItem } from 'src/app/core/models/product.model';

@Component({
  selector: 'app-delete-modal',
  templateUrl: './delete-modal.component.html',
  styleUrls: ['./delete-modal.component.css']
})
export class DeleteModalComponent {
  @Input() isVisible = false;
  @Input() product!: ProductItem;
  @Input() showSuccessMessage = false;
  @Input() showErrorMessage = false;

  @Output() deleteConfirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  cancelDelete(): void {
    this.cancelClicked.emit();
  }

  confirmDelete(): void {
    this.deleteConfirmed.emit(true);
  }
}
