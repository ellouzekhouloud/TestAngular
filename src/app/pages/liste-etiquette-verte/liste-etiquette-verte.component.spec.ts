import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeEtiquetteVerteComponent } from './liste-etiquette-verte.component';

describe('ListeEtiquetteVerteComponent', () => {
  let component: ListeEtiquetteVerteComponent;
  let fixture: ComponentFixture<ListeEtiquetteVerteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeEtiquetteVerteComponent]
    });
    fixture = TestBed.createComponent(ListeEtiquetteVerteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
