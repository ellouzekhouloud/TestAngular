import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPPmComponent } from './dashboard-ppm.component';

describe('DashboardPPmComponent', () => {
  let component: DashboardPPmComponent;
  let fixture: ComponentFixture<DashboardPPmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardPPmComponent]
    });
    fixture = TestBed.createComponent(DashboardPPmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
