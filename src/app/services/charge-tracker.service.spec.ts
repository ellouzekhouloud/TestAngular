import { TestBed } from '@angular/core/testing';

import { ChargeTrackerService } from './charge-tracker.service';

describe('ChargeTrackerService', () => {
  let service: ChargeTrackerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChargeTrackerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
