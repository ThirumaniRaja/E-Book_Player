import { PDFDocumentProxy } from 'pdfjs-dist';
import {
  Component,
  Input,
  Output,
  ViewChild,
  ElementRef,
  EventEmitter, OnInit
} from '@angular/core';
import { ResourceType } from 'libs/e-book-player/src/lib/enums/resource-type.enum';

interface CustomPdfEvent {
  source: any;
  pageNumber: number;
  cssTransform: boolean;
}

interface CurrentPage {
  pageNumber: number;
  eventType: string;
}

@Component({
  selector: 'ebook-player-view-pdf',
  templateUrl: './view-pdf.component.html',
  styleUrls: ['./view-pdf.component.scss']
})
export class ViewPdfComponent  {

  @ViewChild('pdfWrapper', { static: true }) pdfWrapper: ElementRef;
  @Input() pdfId: string;
  @Input() src: string;
  @Input() renderText = true;
  @Input() showAll: string;
  @Input() stickToPage: string;
  @Input() numEbookPages: [];
  @Input('currentPage') set currentPage(value: CurrentPage) {
    if (value) {
      this.pdfCurrentPageObj = value;
      if (value.eventType === 'click') {
        this.gotoPage(value.pageNumber);
      }
    }
  }

  @Output() emitPdfLoadComplete = new EventEmitter();
  @Output() emitPdfRendered = new EventEmitter();
  @Output() emitScrollPageChange = new EventEmitter();
  @Output() emitGotoNextChapter = new EventEmitter();

  pdfPageCollection: HTMLCollection;
  currentPdfPage: HTMLElement;

  public togglePdf = false;
  public pdfRendered = false;

  //these 2 current page vars are here cause the pdf viewer has 2 way binding [(page)]
  //we need the obj to track click and scroll from the service, cause a click scrollTop will also trigger a scroll event
  public pdfCurrentPageObj: { pageNumber: number; eventType: string };
  public pdfViewerCurrentPage = 1;

  constructor(){
    this.pdfId = "pdf-d"
    console.log("pdfId.........................",this.pdfId)

  }

  pageRendered(e: CustomPdfEvent) {
    //on last rendered page, this fires for each page rendered
    if (e.pageNumber === this.numEbookPages.length) {
      this.gotoPage(this.pdfCurrentPageObj.pageNumber);
      this.pdfRendered = true;
      //we only want to trigger togglePdf if we are scroll down
      //it is used to remeber scroll state when switching worksheet pages
      if (this.pdfCurrentPageObj.pageNumber !== 1) {
        this.togglePdf = !this.togglePdf;
      }
    }
  }

  afterLoadComplete(pdf: PDFDocumentProxy) {
    this.emitPdfLoadComplete.emit(pdf);
    this.emitPdfRendered.emit(pdf);
  }

  scrollPageChange(currentPageObj: { currentPage: number }) {
    if (this.pdfCurrentPageObj.eventType === 'scroll') {
      this.emitScrollPageChange.emit(currentPageObj);
    }

    this.pdfCurrentPageObj = {
      pageNumber: currentPageObj.currentPage,
      eventType: 'scroll'
    };
  }

  gotoPage(page: number) {
    const pdfWrapper = this.pdfWrapper.nativeElement;
    const pages = pdfWrapper.querySelectorAll('.page');
    const OffsetFromAbsoulteBottom = 10;
    let distanceToScroll = 0;

    if (!pages.length || !page) {
      return;
    }

    if (page === pages.length) {
      distanceToScroll = pages[page - 1].offsetTop - OffsetFromAbsoulteBottom;
    } else {
      distanceToScroll = pages[page - 1].offsetTop;
    }

    pdfWrapper.scrollTop = distanceToScroll;
  }

  resetPdfRender(event: any) {
    this.pdfRendered = false;
  }

  setPdfCurrentPage(pdfCurrentPage: { pageNumber: number; eventType: string }) {
    this.pdfCurrentPageObj = {
      pageNumber: pdfCurrentPage.pageNumber,
      eventType: pdfCurrentPage.eventType
    };
  }

  gotoNextChapter(event: any) {
    this.emitGotoNextChapter.emit();
  }

  get resourceType() {
    return ResourceType;
  }
}
