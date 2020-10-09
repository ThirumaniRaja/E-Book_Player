import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  Input,
  OnDestroy
} from '@angular/core';
import { ScrollState } from '../../enums/scroll.state.enum';

@Component({
  selector: 'ebook-player-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements OnInit, OnDestroy {
  @Output() emitScroll = new EventEmitter();
  @Input('scrollContainerRef') set scrollContainerRef(elem: HTMLElement) {
    if (elem) {
      console.log("ScrollComponent -> @Input -> elem", elem)
      this.scrollElement = elem;
      this.scrollState = this.checkScrollBookends(
        0,
        this.scrollElement.scrollHeight - this.scrollElement.clientHeight
      );
      //console.log( "normal",this.scrollState)
      this.scrollElement.addEventListener('scroll', e => {
        this.scrollState = this.checkScrollBookends(
          this.scrollElement.scrollTop,
          this.scrollElement.scrollHeight - this.scrollElement.clientHeight
        );
        //console.log("addeventLisner",this.scrollState)
      });
    }
  }
  public scrollElement: HTMLElement = null;
  public intervalScroll: number;
  public scrollState: ScrollState = ScrollState.START;

  constructor() {}
  ngOnInit() {}
  ngOnDestroy() {
    //this.scrollElement.removeEventListener('scroll', () => {});
  }

  public checkScrollBookends(currentScrollPos, scrollEndTarget) {
    //console.log("ScrollComponent -> checkScrollBookends -> scrollEndTarget", scrollEndTarget)
    //console.log("ScrollComponent -> checkScrollBookends -> currentScrollPos", currentScrollPos)
    if (currentScrollPos === 0) {
      return ScrollState.START;
    }
    if (currentScrollPos >= scrollEndTarget) {
      return ScrollState.END;
    }

    return null;
  }

  public scrollEvent(direction: string, event: Event) {
    console.log(direction,event)
    const cachedCurrentTarget = event.currentTarget;
    if (event.type === 'mousedown' || event.type === 'touchstart') {
      this.emitScrollEvent(event, cachedCurrentTarget, direction);

      this.intervalScroll = <any>setInterval(() => {
        this.emitScrollEvent(event, cachedCurrentTarget, direction);
      }, 100);
    } else {
      clearInterval(this.intervalScroll);
      this.emitScrollEvent(event, cachedCurrentTarget, direction);
    }
  }

  public emitScrollEvent(
    event: Event,
    cachedCurrentTarget: EventTarget,
    direction: string
  ) {
    this.emitScroll.emit({
      type: direction,
      eventName: event.type,
      _event: event,
      cachedCurrentTarget: cachedCurrentTarget
    });
  }
}
