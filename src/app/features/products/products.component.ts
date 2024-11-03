import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  OnInit,
  Signal,
  signal,
} from '@angular/core';
import { Product } from '../../core/interfaces/product.';
import { ProductsService } from '../../core/services/products.service';
import { debounceTime, map } from 'rxjs';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';
import { SortingPricePipe } from '../../core/pipes/sorting-price.pipe';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PaginationComponent,
    SortingPricePipe,
  ],
  providers: [SortingPricePipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductsComponent implements OnInit {
  orderBy = signal<'asc' | 'desc'>('asc');

  searchVal = signal<string>('');
  searchVal$ = toObservable(this.searchVal);
  debouncedSearchVal = signal('');

  currentPage = signal(1);
  limitPages: number = 8;
  totalProducts = signal<number>(0);

  products = signal<Product[]>([]);
  filteredProducts = computed(() => {
    return this.products().filter((product) => {
      if (product.title.toLowerCase().includes(this.debouncedSearchVal())) {
        return product;
      }
      return;
    });
  });
  slicedProducts = computed(() => {
    let sortedProducts = this.sortingPricePipe.transform(
      this.filteredProducts(),
      this.orderBy()
    );
    return this.sliceProducts(
      this.currentPage(),
      this.limitPages,
      sortedProducts
    );
  });

  constructor(
    private productsService: ProductsService,
    private sortingPricePipe: SortingPricePipe
  ) {
    this.searchVal$
      .pipe(debounceTime(500))
      .subscribe((val) => this.debouncedSearchVal.set(val));

    effect(
      () => {
        this.totalProducts.set(this.filteredProducts().length);
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.productsService.getProducts().subscribe((products) => {
      this.products.set(products);
    });
  }

  changePage(page: number): void {
    this.currentPage.set(page);
  }

  sliceProducts(currentPage: number, limitPages: number, product: Product[]) {
    let trimStart = (currentPage - 1) * limitPages;
    let trimEnd = trimStart + limitPages;
    return product.slice(trimStart, trimEnd);
  }

  toggleOrderBy() {
    if (this.orderBy() == 'asc') {
      this.orderBy.set('desc');
    } else {
      this.orderBy.set('asc');
    }    
  }
}
