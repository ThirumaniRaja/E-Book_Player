import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';
//import paginate from 'jw-paginate';
export declare function paginate(totalItems: number, currentPage?: number, pageSize?: number, maxPages?: number): {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  startPage: number;
  endPage: number;
  startIndex: number;
  endIndex: number;
  pages: number[];
};
//export = paginate;


@Component({
  selector: 'ebook-player-pagination-controls',
  templateUrl: './pagination-controls.component.html',
  styleUrls: ['./pagination-controls.component.scss']
})
export class PaginationControlsComponent implements OnInit, OnChanges {
  @Output() changePage = new EventEmitter<any>(true);
  @Input() initialPage = 1;
  @Input() pageSize = 1;
  @Input() pages: Array<number>;
  @Input() quizQuestionStatuses: Array<string>;
  @Input('selectedPage') set selectedPage(value) {
    if (value.pageNumber !== this.pager.currentPage) {
      this.setPageWithoutEmit(10);
    }
  }

  pager: any = {};
  MAX_NUMBER_PAGES = 7;
  maxPages = this.MAX_NUMBER_PAGES;
  ellipsisStartPages: Array<number> = [];
  ellipsisEndPages: Array<number> = [];

  ngOnInit() {
    // set page if items array isn't empty
    if (this.pages && this.pages.length) {
      this.setPage(this.initialPage);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    //reset page if items array has changed
    if (changes.hasOwnProperty('selectedPage')) {
      if (
        changes.selectedPage.currentValue &&
        changes.selectedPage.previousValue
      ) {
        if (
          changes.selectedPage.currentValue.pageNumber !==
          changes.selectedPage.previousValue.pageNumber
        ) {
          this.setEllipsisPages();
        }
      }
    }
    if (changes.hasOwnProperty('pages')) {
      if (changes.pages.currentValue !== changes.pages.previousValue) {
        if (this.pages.length > this.MAX_NUMBER_PAGES) {
          this.maxPages = this.MAX_NUMBER_PAGES - 2;
        }
        this.setPage(this.initialPage);
      }
    }
  }

  private setPageWithoutEmit(page: number) {
    console.log("setPageWithoutEmit",page)
    this.pager = paginate(
      this.pages.length,
      page,
      this.pageSize,
      this.maxPages
    );
  }

  private setPage(page: number) {
    // get new pager object for specified page
    this.pager = paginate(
      this.pages.length,
      page,
      this.pageSize,
      this.maxPages
    );

    // get new page of items from items array
    const pageOfItems = this.pages.slice(
      this.pager.startIndex,
      this.pager.endIndex + 1
    );

    // call change page function in parent component
    this.changePage.emit(pageOfItems[0] + 1);
    this.setEllipsisPages();
  }

  private quizQuestionStatusPagination(i: number) {
    if (!this.quizQuestionStatuses) {
      return false;
    }

    return this.quizQuestionStatuses[this.pager.startPage - 1 + i];
  }

  private quizQuestionStatus(i: number) {
    if (!this.quizQuestionStatuses) {
      return false;
    }

    return this.quizQuestionStatuses[i];
  }

  private setEllipsisPages() {
    let additionalEllipsesItems = 0;
    this.ellipsisStartPages = [];
    this.ellipsisEndPages = [];

    if (this.pager.startPage > 1) {
      this.ellipsisStartPages = this.pages.slice(0, 1);
      additionalEllipsesItems += this.pager.startPage > 2 ? 2 : 1;
    }

    if (this.pager.endPage < this.pages.length) {
      this.ellipsisEndPages = this.pages.slice(-1);
      additionalEllipsesItems +=
        this.pages.length - this.pager.endPage >= 2 ? 2 : 1;
    }

    this.maxPages = this.MAX_NUMBER_PAGES - additionalEllipsesItems;

    //the following conditionals handle edge cases where there are 4 items in the pagination
    if (this.maxPages === 4 && this.pager.currentPage === 3) {
      this.ellipsisStartPages = [];
      this.maxPages = 5;
    }
    if (
      this.maxPages === 4 &&
      this.pager.currentPage === this.pages.length - 3
    ) {
      this.maxPages = 3;
    }

    this.setPageWithoutEmit(this.pager.currentPage);
  }
}
