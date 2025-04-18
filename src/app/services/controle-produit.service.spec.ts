import { TestBed } from '@angular/core/testing';

import { ControleProduitService } from './controle-produit.service';

describe('ControleProduitService', () => {
  let service: ControleProduitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControleProduitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
