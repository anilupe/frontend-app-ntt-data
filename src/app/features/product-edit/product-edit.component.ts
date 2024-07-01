import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from '../../core/services/product.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  product!: ProductItem;
  showSuccessMessage = false;
  showErrorMessage = false;
  message = '';

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.fetchProduct();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      id: ['', Validators.required],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
  }

  fetchProduct(): void {
    this.activateRoute.queryParams.subscribe(params => {
      const productJson = params['product'];
      if (productJson) {
        this.product = JSON.parse(productJson);
        this.productForm.patchValue(this.product);
        this.subscribeToReleaseDateChanges(this.product.date_release);
      }
    });
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
      const productToEdit: ProductItem = { ...this.productForm.value };
      this.editConfirmed(productToEdit);
    } else {
      this.markFormGroupTouched(this.productForm);
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  restart(): void {
    this.productForm.reset();
    this.showSuccessMessage = false;
    this.showErrorMessage = false;
    this.message = '';
  }

  editConfirmed(product: ProductItem): void {
    this.productService.updateProduct(product.id, product).pipe(
      catchError(error => {
        this.showErrorMessage = true;
        this.message = 'Ocurrió un error al editar el producto';
        return throwError(error);
      })
    ).subscribe(() => {
      this.showSuccessMessage = true;
      this.message = 'Producto editado con éxito';
      this.clearMessagesAfterDelay();
    });
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
      this.message = '';
      this.router.navigate(['/products']);
    }, 2500);
  }
}
