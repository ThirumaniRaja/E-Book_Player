import {
  Directive,
  HostListener,
  ElementRef,
  Output,
  EventEmitter,
  Input
} from '@angular/core';

@Directive({
  selector: '[ebookPlayerPdfScroll]'
})
export class PdfScrollDirective {

  @Output() scrollPageChange = new EventEmitter();
  @Output() resetPdfRender = new EventEmitter();
  @Output() setPdfCurrentPage = new EventEmitter();
  @Output() gotoNextChapter = new EventEmitter();
  @Input() pdfRendered = false;
  @Input('togglePdf') set togglePdf(value: boolean) {
    this.elementRef.nativeElement.scrollTop = this.savedScrollTop;
  }
  public pages: any;
  public currentPage = 1;
  public pdfViewerHeight = 0;
  public pdfContentAreaHeight = 0;
  public scrollEnd = null;
  public nextChapterTimer = null;
  public nextChapterDelay = 2000;
  public savedScrollTop = 0;
  public scrollDirection = '';

  constructor(private elementRef: ElementRef) {}

  checkPageChange(page: number) {
    if (page !== this.currentPage) {
      this.scrollPageChange.emit({
        currentPage: page
      });
    }
    this.currentPage = page;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.pdfRendered = true;
    this.scrollEnd = null;
  }

  @HostListener('scroll', ['$event'])
  onScroll(event) {
    event.preventDefault();

    //pdf viewer will scroll top to 0 before and event fires on new pdf load
    if (this.elementRef.nativeElement.scrollTop !== 0) {
      this.scrollDirection =
        this.elementRef.nativeElement.scrollTop > this.savedScrollTop
          ? 'down'
          : 'up';
      this.savedScrollTop = this.elementRef.nativeElement.scrollTop;
    }

    if (!this.scrollEnd) {
      this.pdfViewerHeight = this.elementRef.nativeElement.querySelector(
        'pdf-viewer'
      ).scrollHeight;
      this.pdfContentAreaHeight = Math.ceil(
        this.elementRef.nativeElement.getBoundingClientRect().height
      );
      this.scrollEnd = this.pdfViewerHeight - this.pdfContentAreaHeight;
    }

    //if new pdf renders we need to rebuild page top distances
    if (this.pdfRendered) {
      if (this.elementRef.nativeElement.querySelectorAll('.page').length) {
        const pages = this.elementRef.nativeElement.querySelectorAll('.page');
        this.pages = [...pages].map(page => {
          const pageTop =
            page.getBoundingClientRect().top +
            page.getBoundingClientRect().height / 2;
          const viewerWrapperTop = this.elementRef.nativeElement.getBoundingClientRect()
            .top;
          const scrollOffset = this.elementRef.nativeElement.scrollTop;
          return {
            //need to account for container distance from top of screen and
            //if we are already scrolled to another page
            yPos: Math.round(pageTop - viewerWrapperTop) + scrollOffset,
            page: page
          };
        });

        this.resetPdfRender.emit();
        this.setPdfCurrentPage.emit({
          pageNumber: this.currentPage,
          eventType: 'scroll'
        });
        this.scrollEnd = null;
      }
    } else {
      if (!this.pages) {
        return;
      }

      if (this.scrollDirection === 'down') {
        for (let i = this.pages.length - 1; i >= 0; i--) {
          if (event.target.scrollTop > this.pages[i].yPos) {
            this.checkPageChange(i + 2);
            break;
          }
        }
      } else {
        for (let i = 0; i < this.pages.length; i++) {
          if (event.target.scrollTop < this.pages[i].yPos) {
            this.checkPageChange(i + 1);
            break;
          }
        }
      }

      clearTimeout(this.nextChapterTimer);
      //check for end of chapter, fire event to goto next chapter
      if (this.scrollEnd <= event.target.scrollTop) {
        this.nextChapterTimer = setTimeout(() => {
          this.gotoNextChapter.emit();
        }, this.nextChapterDelay);
      }
    }
  }
}
