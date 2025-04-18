import { TestBed } from '@angular/core/testing';

import { EtiquetteVerteService } from './etiquette-verte.service';

describe('EtiquetteVerteService', () => {
  let service: EtiquetteVerteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiquetteVerteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
