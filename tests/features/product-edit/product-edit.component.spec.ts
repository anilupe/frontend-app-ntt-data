import { ComponentFixture, TestBed, fakeAsync, flush, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductEditComponent } from '../../../src/app/features/product-edit/product-edit.component';
import { ProductService } from '../../../src/app/core/services/product.service';
import { ProductItem } from 'src/app/core/models/product.model';

describe('ProductEditComponent', () => {
  let component: ProductEditComponent;
  let fixture: ComponentFixture<ProductEditComponent>;
  let productServiceMock: any;
  let routerMock: any;
  let activatedRouteMock: any;

  beforeEach(async () => {
    productServiceMock = {
      updateProduct: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    activatedRouteMock = {
      queryParams: of({ product: JSON.stringify({ id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '2024-07-01', date_revision: '2025-07-01' }) })
    };

    await TestBed.configureTestingModule({
      declarations: [ProductEditComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize product form with data from queryParams', () => {
    const expectedData = {
      id: "1",
      name: 'Product 1',
      description: 'Description 1',
      logo: '',
      date_revision: "2025-06-30",  
      date_release: '2024-07-01',
    };
    expect(component.productForm.value).toEqual(expectedData);
  });



  test('should update date_revision when subscribing to release date changes', () => {
    const newReleaseDate = '2025-07-01';
    component.subscribeToReleaseDateChanges(newReleaseDate);
    expect(component.productForm.get('date_revision')!.value).toBe('2026-06-30');
  });

  test('should mark form controls as touched on form submission with invalid data', () => {
    component.onSubmit();
    expect(component.productForm.invalid).toBe(true);
    expect(component.productForm.get('name')!.touched).toBe(true);
    expect(component.productForm.get('description')!.touched).toBe(true);
    expect(component.productForm.get('logo')!.touched).toBe(true);
    expect(component.productForm.get('date_release')!.touched).toBe(true);
    expect(component.productForm.get('date_revision')!.touched).toBe(true);
  });

  test('should call productService.updateProduct and navigate on successful edit', fakeAsync(() => {
    const productToUpdate: ProductItem = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: 'updated.png',
      date_release: '2024-07-01',
      date_revision: '2025-07-01'
    };

    productServiceMock.updateProduct.mockReturnValue(of({}));
    component.productForm.patchValue(productToUpdate);
    component.onSubmit();
    tick();
    expect(productServiceMock.updateProduct).toHaveBeenCalledWith('1', productToUpdate);
    expect(component.showSuccessMessage).toBe(true);
    flush();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  }));



  test('should reset form on restart', () => {
    component.restart();
    expect(component.productForm.pristine).toBe(true);
    expect(component.productForm.get('name')!.touched).toBe(false);
    expect(component.productForm.get('description')!.touched).toBe(false);
    expect(component.productForm.get('logo')!.touched).toBe(false);
    expect(component.productForm.get('date_release')!.touched).toBe(false);
    expect(component.productForm.get('date_revision')!.touched).toBe(false);
  });

  test('should clear success and error messages after delay', fakeAsync(() => {
    component.clearMessagesAfterDelay();
    tick(3000);
    expect(component.showSuccessMessage).toBe(false);
    expect(component.showErrorMessage).toBe(false);
  }));
});
