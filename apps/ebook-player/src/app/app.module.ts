import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EBookPlayerModule } from '../../../../libs/e-book-player/src/lib/e-book-player.module';
import { AppComponent } from './app.component';
import { from } from 'rxjs';
import { AngularSvgIconModule } from 'angular-svg-icon';
import {LibConfigModule ,DynamicComponentManifest } from 'libs/lib-config/src/lib/lib-config/lib-config.module'
import { HttpClient } from '@angular/common/http';

const manifests: DynamicComponentManifest[] = [
  {
    componentId: 'load-player',
    path: 'load-player', // some globally-unique identifier, used internally by the router
    loadChildren: () =>
      import('../../../../libs/e-book-player/src/lib/e-book-player.module').then(
        mod => mod.EBookPlayerModule)
  }];
@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule,
    AngularSvgIconModule,
    EBookPlayerModule,
    LibConfigModule.forRoot(manifests)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
