import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  productForm!: FormGroup;
  revisionDate = '';
  showSuccessMessage: any;
  message: any;
  showErrorMessage: any;
  product!: ProductItem;

  constructor(private fb: FormBuilder, private productService: ProductService, private router: Router, private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activateRoute.queryParams.subscribe(params => {
      const productJson = params['product'];
      if (productJson) {
        this.product = JSON.parse(productJson);
      }
    });

    this.initializeForm();
  }

  initializeForm(): void {
    this.productForm = this.fb.group({
      id: [ '', Validators.required],
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: ['', Validators.required]
    });
    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });
    this.productForm.patchValue(this.product);
  }

  subscribeToReleaseDateChanges(newValue: string) {
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
      productToEdit.date_revision = this.productForm.get('date_revision')?.value;
      productToEdit.id = this.productForm.get('id')?.value;
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

    Object.values(this.productForm.controls).forEach(control => {
      control.markAsTouched();
    });

  }

  editConfirmed(product: ProductItem): void {
    this.productService.updateProduct(product.id, product).subscribe({
      next: () => {
        this.showSuccessMessage = true;
        this.message = 'Producto editado con éxito'
        this.clearMessagesAfterDelay();
      },
      error: () => {
        this.showErrorMessage = true;
        this.message = 'Ocurrió un error en editar producto'
        this.clearMessagesAfterDelay();
      }
    });
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
      this.router.navigate(['/products']);
    }, 3000);
  }

}
