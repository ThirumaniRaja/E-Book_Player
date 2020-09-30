import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PdfScrollDirective } from './directives/pdf-scroll.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { ViewPdfComponent } from './components/view-pdf/view-pdf.component';

@NgModule({
  imports: [CommonModule,PdfViewerModule],
  declarations: [PdfScrollDirective, ViewPdfComponent],
  exports: [ViewPdfComponent],
  entryComponents: [ViewPdfComponent]
})
export class ViewerPdfModule {}
