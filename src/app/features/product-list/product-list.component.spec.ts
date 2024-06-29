import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductListComponent } from './product-list.component';
import { ProductService } from '../../core/services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProductItem } from '../../core/models/product.model';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productService: ProductService;

  const mockProducts: ProductItem[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'logo1.png',
      date_release: '2023-01-01',
      date_revision: '2023-01-10'
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'logo2.png',
      date_release: '2023-02-01',
      date_revision: '2023-02-10'
    },
    // Agrega más productos de ejemplo si es necesario
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductListComponent],
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    jest.spyOn(productService, 'getProducts').mockReturnValue(of({ data: mockProducts }));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch products on init', () => {
    component.ngOnInit();
    expect(component.products).toEqual(mockProducts);
  });

  it('should search products correctly', () => {
    const searchTerm = 'Product 1'; 

    component.searchTerm = searchTerm; 
    component.searchProducts(); 

    expect(component.filteredProducts.length).toBe(1);
    expect(component.filteredProducts[0].name).toContain(searchTerm);
  });
});
