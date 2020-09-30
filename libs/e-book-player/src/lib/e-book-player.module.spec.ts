import { async, TestBed } from '@angular/core/testing';
import { EBookPlayerModule } from './e-book-player.module';

describe('EBookPlayerModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [EBookPlayerModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(EBookPlayerModule).toBeDefined();
  });
});
