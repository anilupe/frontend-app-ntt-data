import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { Product, ProductItem } from '../models/product.model';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch products from API via GET', () => {
    const mockProducts: Product = {
      data: [
        { id: '1', name: 'Product 1', description: 'Description 1', logo: '', date_release: '', date_revision: '' },
        { id: '2', name: 'Product 2', description: 'Description 2', logo: '', date_release: '', date_revision: '' }
      ]
    };

    service.getProducts().subscribe((products: Product) => {
      expect(products).toBeTruthy();
      expect(products.data.length).toBe(2);
      expect(products.data).toEqual(mockProducts.data);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should add a product via POST', () => {
    const mockProduct: ProductItem = {
      id: '1',
      name: 'New Product',
      description: 'New Description',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    service.addProduct(mockProduct).subscribe((product: ProductItem) => {
      expect(product).toBeTruthy();
      expect(product.id).toBe('1'); // Mock backend response if needed
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    req.flush(mockProduct);
  });

  it('should update a product via PUT', () => {
    const productId = '1';
    const mockProduct: ProductItem = {
      id: '1',
      name: 'Updated Product',
      description: 'Updated Description',
      logo: '',
      date_release: '',
      date_revision: ''
    };

    service.updateProduct(productId, mockProduct).subscribe((product: ProductItem) => {
      expect(product).toBeTruthy();
      expect(product.id).toBe('1'); // Mock backend response if needed
    });

    const req = httpMock.expectOne(`/bp/products/${productId}`);
    expect(req.request.method).toBe('PUT');
    req.flush(mockProduct);
  });

  it('should delete a product via DELETE', () => {
    const productId = '1';

    service.deleteProduct(productId).subscribe(() => {
      // Test success case
    });

    const req = httpMock.expectOne(`/bp/products/${productId}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('should validate product ID via GET', () => {
    const productId = '1';
    const mockValidationResponse = true;

    service.validateId(productId).subscribe((response: boolean) => {
      expect(response).toBe(mockValidationResponse);
    });

    const req = httpMock.expectOne(`/bp/products/verification/${productId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockValidationResponse);
  });
});
