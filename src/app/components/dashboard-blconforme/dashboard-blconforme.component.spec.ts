import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardBLConformeComponent } from './dashboard-blconforme.component';

describe('DashboardBLConformeComponent', () => {
  let component: DashboardBLConformeComponent;
  let fixture: ComponentFixture<DashboardBLConformeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardBLConformeComponent]
    });
    fixture = TestBed.createComponent(DashboardBLConformeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
