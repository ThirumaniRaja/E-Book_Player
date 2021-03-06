import { Component, ComponentFactoryResolver, ElementRef, HostBinding, OnInit, ViewChild } from '@angular/core';
import { LibConfigService } from 'libs/lib-config/src/lib/services/lib-config.service';
import { Subscription } from 'rxjs';
import { QuickNavType } from '../../enums/quick-nav-type.enum';
import { Chapter, Ebook, Resource } from '../../models/curriculum.interface';
import { EbookService } from '../../services/ebook.service';

@Component({
  selector: 'ebook-player-ebook-player',
  templateUrl: './ebook-player.component.html',
  styleUrls: ['./ebook-player.component.scss']
})
export class EbookPlayerComponent implements OnInit {
  @ViewChild('middleDrawer', { static: false }) middleDrawer: ElementRef;
  public toggle = {
    left: false,
    right: false
  };
  public hasChapterResources = false;
  public showThumbnails = false;
  public numEbookPages: any[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16];
  public pdfFilePath: any;
  public ebooks: Ebook[];
  public selectedEbook: Ebook;
  public selectedChapter: Chapter;
  public selectedPage: { pageNumber: number; eventType: string };
  public pdfSource: string;
  public pdfId: string;
  public initialPage = 1;
  public quickNavSelection: QuickNavType = QuickNavType.PAGE;
  public quickNavType = QuickNavType;
  public showTooltip = false;
  public isKeyboardOpen = false;
  public $subs = new Subscription();
  public scrollContainerRef: HTMLElement;
  public chapterResources: Resource[] = [];
  public isebookResourceOpen = false;
  public currentChapterId: any;
  playerFactory;
  @HostBinding('class') get hostClasses() {
    let classes = '';
    if (this.isebookResourceOpen) {
      classes += ' container-displayN';
    }
    return classes;
  }

  constructor(
    private libConfigService: LibConfigService,
    private factoryResolver: ComponentFactoryResolver,
    public ebookService: EbookService,
   
  ) { }

  ngOnInit() {
    this.selectedPage = {eventType:"click",pageNumber:1}
    console.log("(((((((((ebokokkkkkkkkkkkkkkkkkkkk ",this.numEbookPages,this.selectedPage);
    
    this.$subs.add(
      this.ebookService.pageSelection$.subscribe(
        page => {this.selectedPage = page
          console.log("selectedPage--------------------->******************************",this.selectedPage)
        }
      )
    );

    this.$subs.add(
      this.ebookService.activePdf$.subscribe(pdf => {
        this.pdfFilePath = pdf;
      })
    );

   
  }

  public beginLoadingResource() {
   
    if (this.currentChapterId) {
      //this.ebookService.setResourceData(this.resource, this.currentChapterId);
    }

    //old code
    //this.ebookService.setResourceData(this.resource);
  }

  ngOnDestroy() {
    this.$subs.unsubscribe();
  }

  public pdfRendered(customPdfEvent: {
    cssTransform: boolean;
    currentPage: number;
    source: any;
  }) {
   
  }

  public getPageData(pdf: any) {

    this.pdfId = pdf._pdfInfo.fingerprint;
  }

  public toggleBar(state: string) {
    if (state === 'left') {
      this.toggle.left = !this.toggle.left;
    } else {
      this.toggle.right = !this.toggle.right;
    }
  }

  public toggleThumbnails(event: any) {
    this.showThumbnails = true;
  }

  public triggerScroll(emittedObject: {
    eventName: string;
    type: string;
    cachedCurrentTarget: any;
  }) {
    console.log("emitkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkkk",emittedObject)
    if (
      emittedObject.eventName === 'click' ||
      emittedObject.eventName === 'touchstart'
    ) {
      const pdfElement =
        emittedObject.cachedCurrentTarget.parentNode.parentNode.parentNode
          .parentNode.parentNode.previousElementSibling.firstChild.firstChild;
      if (emittedObject.type === 'up') {
        pdfElement.scrollTop -= 20;
      } else {
        pdfElement.scrollTop += 20;
      }
    }
  }

  public updatePdfPage(currentPageObj: { currentPage: number }) {
    this.ebookService.setPageSelection({
      pageNumber: currentPageObj.currentPage,
      eventType: 'scroll'
    });
  }

  public gotoNextChapter(event: any) {
    const currentChapterIndex = this.selectedEbook.chapters.findIndex(
      chapter => {
        return chapter.chapterId === this.selectedChapter.chapterId;
      }
    );

    if (currentChapterIndex + 1 <= this.selectedEbook.chapters.length - 1) {
      this.ebookService.setChapterSelection(
        this.selectedEbook.chapters[currentChapterIndex + 1]
      );
      this.ebookService.setPageSelection({
        pageNumber: 1,
        eventType: 'click'
      });
    }
  }

  public pageChange(pageNumber: number) {
    this.ebookService.setPageSelection({
      pageNumber: pageNumber,
      eventType: 'click'
    });
  }

  public goToPage(val: string) {
    const pageChapter = parseInt(val, 10);

    if (this.quickNavSelection === QuickNavType.PAGE) {
      let page = pageChapter === 0 ? 1 : pageChapter;
      page =
        page > this.numEbookPages.length ? this.numEbookPages.length : page;
      this.ebookService.setPageSelection({
        pageNumber: page,
        eventType: 'click'
      });
    
    } else {
      let chapterNum = pageChapter === 0 ? 1 : pageChapter;
      chapterNum =
        pageChapter > this.selectedEbook.chapters.length
          ? this.selectedEbook.chapters.length
          : pageChapter;
      this.ebookService.setChapterSelection(
        this.selectedEbook.chapters[chapterNum - 1]
      );
      this.ebookService.setPageSelection({
        pageNumber: 1,
        eventType: 'click'
      });
    }
  }

  public updateKeyboardValue(e: KeyboardEvent) {
    
  }

  public setKeyboardFocus(e: FocusEvent) {
    
  }
}
