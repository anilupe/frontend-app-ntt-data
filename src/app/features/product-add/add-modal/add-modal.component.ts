import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, map, catchError, of } from 'rxjs';
import { ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrls: ['./add-modal.component.css']
})
export class AddModalComponent implements OnInit{
  @Input() isVisible: boolean = false;
  @Input() product!: ProductItem;
  @Input() showSuccessMessage: boolean = false;
  @Input() showErrorMessage: boolean = false;

  @Output() addConfirmed: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() cancelClicked: EventEmitter<void> = new EventEmitter<void>();

  productForm!: FormGroup;
  idExistsError = false; 


  constructor(private fb: FormBuilder, private productService: ProductService) { }
  ngOnInit(): void {
    this.productForm = this.fb.group({
      id: ['', {
        validators: [Validators.required, Validators.minLength(3), Validators.maxLength(10)],
        asyncValidators: [this.validateProductId.bind(this)],
        updateOn: 'blur' 
      }],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: true }, Validators.required] 
    });
    this.productForm.get('date_release')!.valueChanges.subscribe((value) => {
      if (value) {
        const releaseDate = new Date(value);
        const revisionDate = new Date(releaseDate.getFullYear() + 1, releaseDate.getMonth(), releaseDate.getDate());
        this.productForm.patchValue({
          date_revision: revisionDate.toISOString().substring(0, 10) 
        });
      }
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control!.invalid && (control!.dirty || control!.touched);
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log(this.productForm.value);
    } else {
      console.log('Formulario inválido. Verifique los campos.');

    }
  }

  showError(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control?.errors?.['required'];
  }
  
  markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }


  cancelDelete() {
    this.cancelClicked.emit();
  }

  validateProductId(control: AbstractControl): Observable<ValidationErrors | null> {
    const productId = control.value;
    return this.productService.validateId(productId).pipe(
      map(exists => (exists ? { idExists: true } : null)),
      catchError(() => of(null)) 
    );
  }
  dateRevisionValidator(control: AbstractControl): ValidationErrors | null {
    const releaseDate = control.get('date_release')!.value;
    const revisionDate = control.get('date_revision')!.value;

    if (releaseDate && revisionDate) {
      const oneYearAfterRelease = new Date(releaseDate);
      oneYearAfterRelease.setFullYear(oneYearAfterRelease.getFullYear() + 1);

      if (oneYearAfterRelease.toISOString() !== new Date(revisionDate).toISOString()) {
        return { dateMismatch: true };
      }
    }
    return null;
  }
}
