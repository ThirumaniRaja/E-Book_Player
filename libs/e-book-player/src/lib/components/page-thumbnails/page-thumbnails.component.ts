import { Component, Input, OnInit } from '@angular/core';
import { Ebook } from '../../models/curriculum.interface';
import { EbookService } from '../../services/ebook.service';

@Component({
  selector: 'ebook-player-page-thumbnails',
  templateUrl: './page-thumbnails.component.html',
  styleUrls: ['./page-thumbnails.component.scss']
})
export class PageThumbnailsComponent implements OnInit {
  @Input('pdfSrc') set pdfSrc(value) {
    this.pdfFilePath = value;
  }
  @Input() numEbookPages: [];
  @Input() ebooks: Ebook[];
  @Input() selectedPage: number;
  public selectedThumbnail = 0;
  public pdfFilePath: string;
  constructor(private ebookService :EbookService) { }

  ngOnInit(): void {
    console.log("numEbookPages--------tumbbbbbbbbbbbbbb",this.pdfFilePath)
  }
  public selectPage(i: number) {
    this.ebookService.setPageSelection({
      pageNumber: i + 1,
      eventType: 'click'
    });
  }

}
