import { Pipe, type PipeTransform } from '@angular/core';
import { Product } from '../interfaces/product.';

@Pipe({
  name: 'appSortingPrice',
  standalone: true,
})
export class SortingPricePipe implements PipeTransform {

  transform(value: Product[], order: "asc" | "desc" = "asc"): Product[] {
    return value.sort((a, b) => {
      if (order === "asc") {
        return a.price - b.price;
      } else if (order === "desc") {
        return b.price - a.price;
      }
      return 0;
    });
  }

}
