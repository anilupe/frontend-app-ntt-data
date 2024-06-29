import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProductService } from 'src/app/core/services/product.service';
import { ProductItem } from 'src/app/core/models/product.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit, OnDestroy {
  products: ProductItem[] = [];
  filteredProducts: ProductItem[] = [];
  searchTerm = '';
  pageSize = 5;
  showDeleteConfirmation = false;
  productToDelete!: ProductItem;
  showSuccessMessage = false;
  showErrorMessage = false;
  isLoading = true;
  showAdd = false;
  private subscriptions = new Subscription();

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  fetchProducts(): void {
    this.isLoading = true;
    const productsSubscription = this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products.data;
        this.updateFilteredProducts();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
    this.subscriptions.add(productsSubscription);
  }

  updateFilteredProducts(): void {
    this.filteredProducts = this.products.slice(0, this.pageSize);
  }

  onPageSizeChange(): void {
    this.updateFilteredProducts();
  }
  addProduct() {
   
    this.showAdd = true;
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  editProduct(product: ProductItem): void {
    this.router.navigate(['/editar-producto', product.id], { queryParams: { disableId: true } });
  }

  showDeleteModal(product: ProductItem): void {
    this.productToDelete = product;
    this.showDeleteConfirmation = true;
  }

  deleteConfirmed(confirmed: boolean): void {
    if (confirmed && this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.showSuccessMessage = true;
          this.showDeleteConfirmation = false;
          this.clearMessagesAfterDelay();
          this.fetchProducts(); 
        },
        error: () => {
          this.showErrorMessage = true;
          this.showDeleteConfirmation = false;
          this.clearMessagesAfterDelay();
        }
      });
    }
  }
  
  addConfirmed(confirmed: boolean): void {
    if (confirmed && this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.showSuccessMessage = true;
          this.showDeleteConfirmation = false;
          this.clearMessagesAfterDelay();
          this.fetchProducts(); 
        },
        error: () => {
          this.showErrorMessage = true;
          this.showDeleteConfirmation = false;
          this.clearMessagesAfterDelay();
        }
      });
    }
  }

  cancelDeleteModal(): void {
    this.showDeleteConfirmation = false;
  }
  cancelAddModal(): void {
    this.showAdd = false;
  }

  clearMessagesAfterDelay(): void {
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.showErrorMessage = false;
    }, 2000);
  }
}
