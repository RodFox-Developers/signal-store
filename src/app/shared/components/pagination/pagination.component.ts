import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges{
  @Input() currentPage!: number;
  @Input() totalProducts!: number;
  @Input() limitPages!: number;
  @Output() changePage = new EventEmitter<number>();

  pages: number[] = [];
  pagesCount!: number;

  ngOnChanges(): void {    
    this.pagesCount = Math.ceil(this.totalProducts / this.limitPages);  
    this.pages = this.rage(1, this.pagesCount);      
  }

  rage(start: number, end: number): number[] {
    return [...Array(end).keys()].map((el) => el + start);
  }
}
