import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UtilityBarComponent } from './components/utility-bar/utility-bar.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { PaginationControlsComponent } from './components/pagination-controls/pagination-controls.component';

@NgModule({
  imports: [CommonModule,AngularSvgIconModule],
  declarations: [UtilityBarComponent, PaginationControlsComponent],
  exports: [UtilityBarComponent, PaginationControlsComponent],
  entryComponents: [UtilityBarComponent, PaginationControlsComponent]
})
export class CoreModule {}
