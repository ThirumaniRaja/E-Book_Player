import { Component, Input, OnInit, Output ,EventEmitter} from '@angular/core';


@Component({
  selector: 'ebook-player-book-details-nav',
  templateUrl: './book-details-nav.component.html',
  styleUrls: ['./book-details-nav.component.scss']
})
export class BookDetailsNavComponent implements OnInit {
  @Output() openThumbnails: EventEmitter<boolean> = new EventEmitter();
  @Input() numEbookPages: Array<number>;
  @Input() showThumbnails: boolean;
  constructor() { }

  ngOnInit(): void {
    console.log(this.numEbookPages)
  }


}
