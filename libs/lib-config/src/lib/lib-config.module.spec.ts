import { async, TestBed } from '@angular/core/testing';
import { LibConfigModule } from './lib-config.module';

describe('LibConfigModule', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [LibConfigModule]
    }).compileComponents();
  }));

  it('should create', () => {
    expect(LibConfigModule).toBeDefined();
  });
});
