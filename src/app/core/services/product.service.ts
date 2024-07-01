import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product, ProductItem } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = '/bp/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product> {
    return this.http.get<Product>(this.baseUrl);
  }

  addProduct(product: ProductItem): Observable<ProductItem> {
    return this.http.post<ProductItem>(this.baseUrl, product);
  }

  updateProduct(id: string, product: ProductItem): Observable<ProductItem> {
    return this.http.put<ProductItem>(`${this.baseUrl}/${id}`, product);
  }

  deleteProduct(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  
  validateId(id:string){
    return this.http.get<boolean>(`/bp/products/verification/${id}`);
  }
}
