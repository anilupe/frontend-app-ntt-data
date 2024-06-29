import { Component, OnInit } from '@angular/core';
import { Product, ProductItem } from 'src/app/core/models/product.model';
import { ProductService } from 'src/app/core/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: ProductItem[] = [];
  searchTerm: string = '';
  filteredProducts: ProductItem[] = []; // Agrega esta línea para declarar filteredProducts

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProducts().subscribe((products) => {
      this.products = products.data; // Asigna products.data en lugar de products
      console.log(this.products);
    });
  }

  searchProducts(): void {
    this.filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

}
