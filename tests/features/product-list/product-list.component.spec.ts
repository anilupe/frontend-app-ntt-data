import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from '../../../src/app/features/product-list/product-list.component';
import { ProductService } from '../../../src/app/core/services/product.service';
import { ProductItem } from '../../../src/app/core/models/product.model';
import { DeleteModalComponent } from 'src/app/features/product-delete/delete-modal/delete-modal.component';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    productServiceMock = {
      getProducts: jest.fn(),
      deleteProduct: jest.fn()
    };

    routerMock = {
      navigate: jest.fn()
    };

    await TestBed.configureTestingModule({
      declarations: [ProductListComponent, DeleteModalComponent],
      imports: [
        FormsModule, // Agrega FormsModule aquí
        RouterTestingModule
      ],
      providers: [
        { provide: ProductService, useValue: productServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    const products: ProductItem[] = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' }
    ];

    productServiceMock.getProducts.mockReturnValue(of({ data: products }));
    fixture.detectChanges();
    expect(productServiceMock.getProducts).toHaveBeenCalled();
    expect(component.products).toEqual(products);
  });

  it('should handle fetch products error', () => {
    productServiceMock.getProducts.mockReturnValue(throwError(() => new Error('error')));
    fixture.detectChanges();
    expect(component.isLoading).toBe(false);
  });

  it('should update filtered products on page size change', () => {
    component.products = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: '', date_release: '', date_revision: '' }
    ];
    component.pageSize = 1;
    component.onPageSizeChange();
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should filter products based on search term', () => {
    component.products = [
      { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' },
      { id: '2', name: 'Product 2', description: 'Description 2', logo: '', date_release: '', date_revision: '' }
    ];
    component.searchTerm = 'Product 1';
    component.searchProducts();
    expect(component.filteredProducts.length).toBe(1);
  });

  it('should navigate to edit product page', () => {
    const product = { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' };
    component.editProduct(product);
    expect(routerMock.navigate).toHaveBeenCalledWith(['/features/edit'], { queryParams: { product: JSON.stringify(product) } });
  });

  it('should navigate to add product page', () => {
    component.addProduct();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/features/add']);
  });

  it('should show delete modal', () => {
    const product = { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' };
    component.showDeleteModal(product);
    expect(component.productToDelete).toEqual(product);
    expect(component.showDeleteConfirmation).toBe(true);
  });

  it('should handle product deletion', () => {
    const product = { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' };
    component.productToDelete = product;

    productServiceMock.deleteProduct.mockReturnValue(of({}));
    component.deleteConfirmed(true);
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(component.showSuccessMessage).toBe(true);
  });

  it('should handle product deletion error', () => {
    const product = { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' };
    component.productToDelete = product;

    productServiceMock.deleteProduct.mockReturnValue(throwError(() => new Error('error')));
    component.deleteConfirmed(true);
    expect(productServiceMock.deleteProduct).toHaveBeenCalledWith(product.id);
    expect(component.showErrorMessage).toBe(true);
  });
});
