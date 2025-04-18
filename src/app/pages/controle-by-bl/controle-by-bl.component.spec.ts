import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControleByBlComponent } from './controle-by-bl.component';

describe('ControleByBlComponent', () => {
  let component: ControleByBlComponent;
  let fixture: ComponentFixture<ControleByBlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ControleByBlComponent]
    });
    fixture = TestBed.createComponent(ControleByBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
