import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { map, Observable } from 'rxjs';
import { Product } from '../interfaces/product.';

@Injectable({
  providedIn: 'root',
})
export class ProductsService extends ApiService {

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.apiUrl + '/products');
  }

}
