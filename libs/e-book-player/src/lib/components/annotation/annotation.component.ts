import {
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {ToolType} from '../../enums/ToolType';
import {ResourceType} from 'libs/e-book-player/src/lib/enums/resource-type.enum';
// import {
//   AppConfigService,
//   ContentResizeService,
//   PanZoomService,
//   ResourceType,
//   ToolbarService,
//   ToolType,
//   CurriculumPlaylistService
// } from '@tce/core';
import Konva from 'konva';
import { KonvaEventObject } from 'konva/types/Node';
import { from } from 'rxjs';
@Component({
  selector: 'ebook-player-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  @Input() canvasContext: ResourceType;
  @Input() ignoreScale = false;
  @Input() set stageId(stageId: string) {
    if (stageId && stageId !== this.activeStageId) {
      this.activeStageId = stageId;
      if (this.canvasContext !== ResourceType.TCEVIDEO) {
        this.sizingReferenceElement = this.elRef.nativeElement.parentElement;
        this.createOrLoadKonvaStage();
      }
    }
  }

  sizingReferenceElement: HTMLElement;
  sizingReferenceInterval;

  activeStageId: string;
  isAnnotationLayerHidden = false;
  isAnnotationLayerNonBlocking = false;

  isDrawing = false;
  konvaStage: Konva.Stage;
  konvaLayer: Konva.FastLayer;
  previousLine: Konva.Line;
  annotationTimeout: NodeJS.Timer;

  currentScale = 1;

  currentTool: string;
  currentToolColor: string;
  currentToolStroke: number;
  public strokeWidth: number;
  public selectedPenSize: any = 1;
  annotationBehavior: 'fade' | 'overlay' = 'overlay';
  boundPostFade = this.postFade.bind(this);

  @HostBinding('class.-hide-annotation-layer') get annotationLayerVisible() {
    return this.isAnnotationLayerHidden;
  }

  @HostBinding('class.-non-blocking') get annotationLayerNonBlocking() {
    return this.isAnnotationLayerNonBlocking;
  }

  @HostBinding('class.position-center') get positionCenter() {
    return this.canvasContext === ResourceType.TCEVIDEO;
  }

  @ViewChild('konvaContainer', { static: true }) konvaContainer: ElementRef<
    HTMLDivElement
  >;

  constructor(
    private elRef: ElementRef<HTMLDivElement>,
    // private toolbarService: ToolbarService,
    // private contentResizeService: ContentResizeService,
    // private appConfigService: AppConfigService,
    // private panzoomService: PanZoomService
  ) {
    // this.toolbarService.clearAllAnnotationsBroadcaster$.subscribe(() => {
    //   this.clearLayer();
    // });
  }

  @HostListener('contextmenu', ['$event'])
  private preventContextMenu(evnt: MouseEvent) {
    evnt.preventDefault();
    evnt.stopPropagation();
  }

  ngOnInit() {
    // const defaultpensize = this.appConfigService.getConfig('global_setting')[
    //   'default-stroke-size'
    // ];
    // this.strokeWidth = parseInt(defaultpensize, 10);
    // this.toolbarService.currentPenSize.subscribe(data => {
    //   if (data) {
    //     this.selectedPenSize = data;
    //     this.strokeWidth = parseInt(this.selectedPenSize, 10);
    //   }
    // });
    if (
      this.canvasContext === ResourceType.TCEVIDEO ||
      this.canvasContext === ResourceType.QUIZ
    ) {
      this.annotationBehavior = 'fade';
      if (
        this.canvasContext === ResourceType.QUIZ 
       // this.appConfigService.getGlobalSettingConfig('quizannotationbehaviour')
      ) {
        // this.annotationBehavior = this.appConfigService.getGlobalSettingConfig(
        //   'quizannotationbehaviour'
        // );
      }
    }
    // this.toolbarService.currentSelectedTool$.subscribe(tool => {
    //   this.currentTool = tool;
    //   this.toggleVisiblity();
    // });
    // this.toolbarService.selectedToolColor$.subscribe(
    //   toolColor => (this.currentToolColor = toolColor)
    // );

    if (!this.ignoreScale) {
      // this.panzoomService.currentZoomScale$.subscribe(
      //   newScale => (this.currentScale = newScale)
      // );
    }

    this.toggleVisiblity();

    if (this.canvasContext === ResourceType.TCEVIDEO) {
      this.sizingReferenceInterval = setInterval(() => {
        const foundVideoIframe = this.elRef.nativeElement.parentElement.querySelector(
          'iframe'
        );
        if (foundVideoIframe) {
          clearInterval(this.sizingReferenceInterval);
          this.sizingReferenceElement = foundVideoIframe;
          setTimeout(() => {
            this.createOrLoadKonvaStage();
            this.initListeners();
          }, 500);
        }
      }, 1000);
    } else {
      console.log("else")
      this.initListeners();
    }
  }

  initListeners() {
    const parentElement = this.sizingReferenceElement;
    window.addEventListener('resize', this.resizeStage.bind(this));
    parentElement.addEventListener('scroll', this.repositionStage.bind(this));
    // this.contentResizeService.resizeContent$.subscribe(() => {
    //   this.resizeStage();
    // });
  }

  createOrLoadKonvaStage() {
    const stageJSON = sessionStorage.getItem(
      `${this.activeStageId}-annotations`
    );

    if (stageJSON) {
      this.loadStage(stageJSON);
    } else {
      this.createStage();
    }

    this.konvaStage.on('mousedown touchstart', this.beginDrawing.bind(this));
    this.konvaStage.on('mousemove touchmove', this.handleDraw.bind(this));
    this.konvaStage.on(
      'mouseup touchend mouseleave',
      this.handleDrawingComplete.bind(this)
    );
  }

  private loadStage(stageJSON: string) {
    const parentDimensions = this.getParentDimensions();

    try {
      // Reset the stage y prior to loading, dynamically setting it after
      // an already loaded stage doesn't update the position
      const parsedStage = JSON.parse(stageJSON);
      parsedStage.attrs.y = 0;

      this.konvaStage = Konva.Stage.create(
        parsedStage,
        this.konvaContainer.nativeElement
      );
      this.konvaStage.width(parentDimensions.width);
      this.konvaStage.height(parentDimensions.height);
      this.konvaLayer = this.konvaStage.getLayers()[0] as Konva.FastLayer;
    } catch (err) {
      console.error('Error loading existing konva stage: ', err);
      this.createStage();
    }
  }

  private createStage() {
    const container = this.konvaContainer.nativeElement;
    const parentDimensions = this.getParentDimensions();

    this.konvaStage = new Konva.Stage({
      container,
      width: parentDimensions.width,
      height: parentDimensions.height
    });
    this.konvaLayer = new Konva.FastLayer();
    this.konvaStage.add(this.konvaLayer);
  }

  private saveKonvaStage() {
    if (this.konvaStage) {
      sessionStorage.setItem(
        `${this.activeStageId}-annotations`,
        this.konvaStage.toJSON()
      );
    }
  }

  private beginDrawing({ evt }: KonvaEventObject<MouseEvent | TouchEvent>) {
    const PEN_STROKE_WIDTH = this.strokeWidth;
    const ERASER_STROKE_WIDTH = 20;
    const isPen = this.currentTool === ToolType.Pen;
    const isErase = this.currentTool === ToolType.Erase;

    if (!isPen && !isErase) {
      return;
    }
    evt.preventDefault();
    if (this.konvaContainer.nativeElement.classList.contains('fadeout')) {
      this.cancelFade();
    }
    if (this.annotationTimeout) {
      clearTimeout(this.annotationTimeout);
    }

    this.isDrawing = true;

    const pointerPosition = this.konvaStage.getPointerPosition();
    const stagePosition = this.konvaStage.getAbsolutePosition();

    this.previousLine = new Konva.Line({
      stroke: this.currentToolColor,
      lineCap: 'round',
      lineJoin: 'round',
      strokeWidth: isPen ? PEN_STROKE_WIDTH : ERASER_STROKE_WIDTH,
      globalCompositeOperation: isPen ? 'source-over' : 'destination-out',
      points: [
        (pointerPosition.x - stagePosition.x) / this.currentScale,
        pointerPosition.y / this.currentScale - stagePosition.y
      ]
    });

    this.konvaLayer.add(this.previousLine);
    this.handleDraw({
      evt: evt,
      target: <any>evt.target,
      currentTarget: <any>evt.currentTarget,
      cancelBubble: evt.cancelBubble
    });
  }

  private stopDrawing({ evt }: KonvaEventObject<MouseEvent | TouchEvent>) {
    this.isDrawing = false;
  }

  private handleDraw({ evt }: KonvaEventObject<MouseEvent | TouchEvent>) {
    if (!this.isDrawing) {
      return;
    }

    evt.preventDefault();

    const pointerPosition = this.konvaStage.getPointerPosition();
    const stagePosition = this.konvaStage.getAbsolutePosition();

    const newPoints = this.previousLine
      .points()
      .concat([
        (pointerPosition.x - stagePosition.x) / this.currentScale,
        pointerPosition.y / this.currentScale - stagePosition.y
      ]);

    this.previousLine.points(newPoints);
    this.konvaLayer.batchDraw();
  }

  private handleDrawingComplete() {
    this.isDrawing = false;

    if (this.annotationBehavior === 'fade') {
      // const fadeOutDelay = this.appConfigService.getConfig('global_setting')[
      //   'annotationFadeOutDelay'
      // ];

      this.annotationTimeout = setTimeout(() => {
        this.fadeLayer();
      }, 300);
    } else {
      this.saveKonvaStage();
    }
  }

  private cancelFade() {
    this.konvaContainer.nativeElement.removeEventListener(
      'transitionend',
      this.boundPostFade
    );
    this.konvaContainer.nativeElement.classList.add('block-transition');
    this.konvaContainer.nativeElement.classList.remove('fadeout');
    setTimeout(() => {
      this.konvaContainer.nativeElement.classList.remove('block-transition');
    }, 500);
  }
  private fadeLayer() {
    this.konvaContainer.nativeElement.removeEventListener(
      'transitionend',
      this.boundPostFade
    );
    this.konvaContainer.nativeElement.addEventListener(
      'transitionend',
      this.boundPostFade
    );
    this.konvaContainer.nativeElement.classList.add('fadeout');
  }

  private postFade() {
    this.clearLayer();
    this.konvaContainer.nativeElement.classList.add('block-transition');
    this.konvaContainer.nativeElement.classList.remove('fadeout');
    setTimeout(() => {
      this.konvaContainer.nativeElement.classList.remove('block-transition');
    }, 500);
  }

  private clearLayer() {
    this.konvaLayer.destroyChildren();
    this.konvaLayer.clear();
  }

  private repositionStage() {
    const dy = this.sizingReferenceElement.scrollTop;
    console.log("dy......................>",dy)
    this.konvaStage.container().style.transform = 'translateY(' + dy + 'px)';
    this.konvaStage.y(-dy);
    this.konvaStage.batchDraw();
  }

  private getParentDimensions(): {
    width: number;
    height: number;
  } {
    const parent = this.sizingReferenceElement;
    if (this.canvasContext === ResourceType.TCEVIDEO) {
      const parentBoundingClientRect = parent.getBoundingClientRect();
      return {
        width: parentBoundingClientRect.width,
        height: parentBoundingClientRect.height
      };
    }
    return {
      width: parent.clientWidth,
      height: parent.clientHeight
    };
  }

  private resizeStage() {
    setTimeout(() => {
      const parentDimensions = this.getParentDimensions();
      this.konvaStage.width(parentDimensions.width);
      this.konvaStage.height(parentDimensions.height);
    }, 300);
  }

  private toggleVisiblity() {
    this.currentTool === ToolType.Pen || this.currentTool === ToolType.Erase
      ? (this.isAnnotationLayerNonBlocking = false)
      : (this.isAnnotationLayerNonBlocking = true);
  }
}
