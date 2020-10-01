import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityBarComponent } from './components/utility-bar/utility-bar.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';
import { ScrollComponent } from './components/scroll/scroll.component';

@NgModule({
  imports: [CommonModule,AngularSvgIconModule],
  declarations: [UtilityBarComponent, PaginationControlsComponent, ScrollComponent],
  exports: [UtilityBarComponent, PaginationControlsComponent, ScrollComponent],
  entryComponents: [UtilityBarComponent, PaginationControlsComponent, ScrollComponent]
})
export class CoreModule {}
