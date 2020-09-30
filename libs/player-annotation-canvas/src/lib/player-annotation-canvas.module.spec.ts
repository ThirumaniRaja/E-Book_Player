import { async, TestBed } from '@angular/core/testing';
import { PlayerAnnotationCanvasModule } from './player-annotation-canvas.module';

describe('PlayerAnnotationCanvasModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [PlayerAnnotationCanvasModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(PlayerAnnotationCanvasModule).toBeDefined();
  });
});
