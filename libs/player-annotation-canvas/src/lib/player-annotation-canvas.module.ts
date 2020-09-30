import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnnotationComponent } from './components/annotation/annotation.component';

@NgModule({
  imports: [CommonModule],
  declarations: [AnnotationComponent],
  exports: [AnnotationComponent],
  entryComponents: [AnnotationComponent]
})
export class PlayerAnnotationCanvasModule {}
