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
  chapters = [];
  constructor() { }

  ngOnInit(): void {
    this.chapters = [{"chapterNumber":1,"chapterTitle":"chapeter1"},
    {"chapterNumber":2,"chapterTitle":"chapeter2"},
    {"chapterNumber":3,"chapterTitle":"chapeter3"},
    {"chapterNumber":4,"chapterTitle":"chapeter4"},
    {"chapterNumber":5,"chapterTitle":"chapeter5"}]
    console.log(this.numEbookPages)
  }


}
