import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailScrollDirective } from './directives/thumbnail-scroll.directive';
import { BookDetailsNavComponent } from './components/book-details-nav/book-details-nav.component';
import { EbookPlayerComponent } from './components/ebook-player/ebook-player.component';
import { PageThumbnailsComponent } from './components/page-thumbnails/page-thumbnails.component';
import { PlayerResourceComponent } from './components/player-resource/player-resource.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import {LibConfigModule} from 'libs/lib-config/src/lib/lib-config/lib-config.module';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { from } from 'rxjs';
import { EbookService } from './services/ebook.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';
import { ScrollComponent } from './components/scroll/scroll.component';
import { UtilityBarComponent } from './components/utility-bar/utility-bar.component';
import {PaginationControlsComponent} from './components/pagination-controls/pagination-controls.component';
import {AnnotationComponent} from './components/annotation/annotation.component';
import { PdfScrollDirective } from './directives/pdf-scroll.directive';


@NgModule({
  imports: [CommonModule,
    PdfViewerModule,
    HttpClientModule,
    LibConfigModule.forChild(EbookPlayerComponent),
  ],
  declarations: [ThumbnailScrollDirective, BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent,ViewPdfComponent,ScrollComponent,UtilityBarComponent,PaginationControlsComponent,AnnotationComponent,PdfScrollDirective],
  exports: [BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent,ViewPdfComponent,ScrollComponent,UtilityBarComponent,PaginationControlsComponent,AnnotationComponent],
  entryComponents: [BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent,ViewPdfComponent,ScrollComponent,UtilityBarComponent,PaginationControlsComponent,AnnotationComponent],
  providers:[EbookService]
})
export class EBookPlayerModule {}
