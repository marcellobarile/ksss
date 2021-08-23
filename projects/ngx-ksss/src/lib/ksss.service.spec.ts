import { TestBed } from '@angular/core/testing';

import { KsssService } from './ksss.service';

describe('KsssService', () => {
  let service: KsssService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KsssService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
