import { TestBed } from '@angular/core/testing';

import { FicheDeRefusService } from './fiche-de-refus.service';

describe('FicheDeRefusService', () => {
  let service: FicheDeRefusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicheDeRefusService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
