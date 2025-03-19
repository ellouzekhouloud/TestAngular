import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderControleComponent } from './header-controle.component';

describe('HeaderControleComponent', () => {
  let component: HeaderControleComponent;
  let fixture: ComponentFixture<HeaderControleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderControleComponent]
    });
    fixture = TestBed.createComponent(HeaderControleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
