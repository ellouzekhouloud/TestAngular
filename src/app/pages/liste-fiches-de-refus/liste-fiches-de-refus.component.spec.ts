import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeFichesDeRefusComponent } from './liste-fiches-de-refus.component';

describe('ListeFichesDeRefusComponent', () => {
  let component: ListeFichesDeRefusComponent;
  let fixture: ComponentFixture<ListeFichesDeRefusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListeFichesDeRefusComponent]
    });
    fixture = TestBed.createComponent(ListeFichesDeRefusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
