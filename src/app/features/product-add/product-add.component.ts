import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, map, catchError, of } from 'rxjs';
import { ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.css']
})
export class ProductAddComponent implements OnInit {
  productForm!: FormGroup;
  revisionDate = '';
  showSuccessMessage = false;
  showErrorMessage = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
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
      date_revision: ['', Validators.required]
    });
    this.markFormGroupTouched(this.productForm);
  }

  subscribeToReleaseDateChanges(newValue: string): void {
    const releaseDate = new Date(newValue);
    const revisionDate = new Date(releaseDate.getFullYear() + 1, releaseDate.getMonth(), releaseDate.getDate());
    this.productForm.patchValue({
      date_revision: revisionDate.toISOString().substring(0, 10)
    });
  }

  isInvalid(controlName: string): boolean {
    const control = this.productForm.get(controlName);
    return control!.invalid && (control!.dirty || control!.touched);
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const productToAdd: ProductItem = { ...this.productForm.value };
      productToAdd.date_revision = this.productForm.get('date_revision')?.value;
      this.addConfirmed(productToAdd);
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  private addConfirmed(product: ProductItem): void {
    this.productService.addProduct(product).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        this.message = 'Producto agregado con éxito';
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.showErrorMessage = true;
        this.message = 'Ocurrió un error al agregar producto';
        this.clearMessagesAfterDelay();
      }
    });
  }

  restart(): void {
    this.productForm.reset();
    this.markFormGroupTouched(this.productForm);
  }

  validateProductId(control: AbstractControl): Observable<ValidationErrors | null> {
    const productId = control.value;
    if (!productId) {
      return of(null);
    }
    return this.productService.validateId(productId).pipe(
      map(exists => (exists ? { idExists: true } : null)),
      catchError(() => of({ idExists: true })) 
    );
  }
  

   clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
      this.router.navigate(['/products']);
    }, 3000);
  }
}
