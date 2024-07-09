import { ComponentFixture, TestBed, tick, fakeAsync, flush } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductAddComponent } from '../../../src/app/features/product-add/product-add.component';
import { ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

describe('ProductAddComponent', () => {
  let component: ProductAddComponent;
  let fixture: ComponentFixture<ProductAddComponent>;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      addProduct: jest.fn(),
      validateId: jest.fn().mockReturnValue(of(false)),
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductAddComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

  test('should initialize form with default values', () => {
    expect(component.productForm).toBeDefined();
    expect(component.productForm.get('id')).toBeTruthy();
    expect(component.productForm.get('name')).toBeTruthy();
    expect(component.productForm.get('description')).toBeTruthy();
    expect(component.productForm.get('logo')).toBeTruthy();
    expect(component.productForm.get('date_release')).toBeTruthy();
    expect(component.productForm.get('date_revision')).toBeTruthy();
  });

  test('should mark form controls as touched on submit without valid data', () => {
    component.onSubmit();
    expect(component.productForm.invalid).toBe(true);
    expect(component.productForm.get('id')!.touched).toBe(true);
    expect(component.productForm.get('name')!.touched).toBe(true);
    expect(component.productForm.get('description')!.touched).toBe(true);
    expect(component.productForm.get('logo')!.touched).toBe(true);
    expect(component.productForm.get('date_release')!.touched).toBe(true);
    expect(component.productForm.get('date_revision')!.touched).toBe(true);
  });

  test('should call productService.addProduct on submit with valid data', fakeAsync(() => {
    const productToAdd: ProductItem = {
      id: '123555',
      name: 'Test Product',
      description: 'Description',
      logo: 'logo.png',
      date_release: '2024-07-01',
      date_revision: '2025-07-01'
    };

    productServiceMock.addProduct.mockReturnValue(of({}));
    component.productForm.patchValue(productToAdd);
    component.onSubmit();
    tick();
    expect(productServiceMock.addProduct).toHaveBeenCalledWith(productToAdd);

    expect(component.showSuccessMessage).toBe(true);
    flush();

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  }));

  test('should handle productService.addProduct error on submit', fakeAsync(() => {
    const productToAdd: ProductItem = {
      id: '123',
      name: 'Test Product',
      description: 'Description',
      logo: 'logo.png',
      date_release: '2024-07-01',
      date_revision: '2025-07-01'
    };

    component.productForm.patchValue(productToAdd);
    productServiceMock.addProduct.mockReturnValue(throwError(() => new Error('error')));
    component.onSubmit();
    tick();

    expect(productServiceMock.addProduct).toHaveBeenCalledWith(productToAdd);
    expect(component.showErrorMessage).toBe(true);
    flush();  

    expect(routerMock.navigate).toHaveBeenCalledWith(['/products']);
  }));

  test('should subscribe to release date changes and update revision date', () => {
    const newReleaseDate = '2024-07-01';
    component.subscribeToReleaseDateChanges(newReleaseDate);
    expect(component.productForm.get('date_revision')!.value).toBe('2025-06-30');
  });

  test('should reset form and mark as touched on restart', () => {
    component.restart();
    expect(component.productForm.pristine).toBe(true);
    expect(component.productForm.get('id')!.touched).toBe(true);
    expect(component.productForm.get('name')!.touched).toBe(true);
    expect(component.productForm.get('description')!.touched).toBe(true);
    expect(component.productForm.get('logo')!.touched).toBe(true);
    expect(component.productForm.get('date_release')!.touched).toBe(true);
    expect(component.productForm.get('date_revision')!.touched).toBe(true);
  });

  test('should clear success and error messages after delay', fakeAsync(() => {
    component.clearMessagesAfterDelay();
    tick(3000);
    expect(component.showSuccessMessage).toBe(false);
    expect(component.showErrorMessage).toBe(false);
  }));
});
