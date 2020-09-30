import { TestBed } from '@angular/core/testing';

import { LibConfigService } from './lib-config.service';

describe('LibConfigService', () => {
  let service: LibConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LibConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
