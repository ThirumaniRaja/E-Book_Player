import { fn } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { EbookPlayerComponent } from 'libs/e-book-player/src/lib/components/ebook-player/ebook-player.component';
import { LibConfigService } from 'libs/lib-config/src/lib/services/lib-config.service';

@Component({
  selector: 'ebook-player-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('qb', { static: false, read: ViewContainerRef })
  qb: ViewContainerRef | undefined;

  showBtn = true;

  constructor(private libConfigService: LibConfigService) {}

  ngOnInit(): void {}

  loadPlayer() {
    if (this.qb) {
      this.qb.clear();
      this.loadEbookPlayer();
      this.showBtn = false;
    }
  }

  loadEbookPlayer() {
    this.libConfigService
      .getComponentFactory<EbookPlayerComponent>('load-player')
      .subscribe({
        next: componentFactory => {
          if (!this.qb) {
            return;
          }
          const ref = this.qb.createComponent(componentFactory);
          ref.changeDetectorRef.detectChanges();
        },
        error: err => {
          console.warn(err);
        }
      });
  }
}
