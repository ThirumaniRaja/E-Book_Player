import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThumbnailScrollDirective } from './directives/thumbnail-scroll.directive';
import { BookDetailsNavComponent } from './components/book-details-nav/book-details-nav.component';
import { EbookPlayerComponent } from './components/ebook-player/ebook-player.component';
import { PageThumbnailsComponent } from './components/page-thumbnails/page-thumbnails.component';
import { PlayerResourceComponent } from './components/player-resource/player-resource.component';
import { ResourceListComponent } from './components/resource-list/resource-list.component';
import {LibConfigModule} from 'libs/lib-config/src/lib/lib-config/lib-config.module';
import { ViewerPdfModule } from 'libs/viewer-pdf/src/lib/viewer-pdf.module';
import { CoreModule } from 'libs/core/src/lib/core.module';
import { from } from 'rxjs';

@NgModule({
  imports: [CommonModule,
    CoreModule,
    ViewerPdfModule,
    LibConfigModule.forChild(EbookPlayerComponent),
  ],
  declarations: [ThumbnailScrollDirective, BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent],
  exports: [BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent],
  entryComponents: [BookDetailsNavComponent, EbookPlayerComponent, PageThumbnailsComponent, PlayerResourceComponent, ResourceListComponent]
})
export class EBookPlayerModule {}
