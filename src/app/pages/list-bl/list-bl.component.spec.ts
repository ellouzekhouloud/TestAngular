import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListBlComponent } from './list-bl.component';

describe('ListBlComponent', () => {
  let component: ListBlComponent;
  let fixture: ComponentFixture<ListBlComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListBlComponent]
    });
    fixture = TestBed.createComponent(ListBlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
