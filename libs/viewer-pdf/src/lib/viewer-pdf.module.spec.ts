import { async, TestBed } from '@angular/core/testing';
import { ViewerPdfModule } from './viewer-pdf.module';

describe('ViewerPdfModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ViewerPdfModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(ViewerPdfModule).toBeDefined();
  });
});
