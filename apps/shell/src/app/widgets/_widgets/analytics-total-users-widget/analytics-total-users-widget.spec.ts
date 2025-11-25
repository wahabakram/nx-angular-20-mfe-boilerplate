import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalUsersWidget } from './analytics-total-users-widget';

describe('AnalyticsTotalUsersWidget', () => {
  let component: AnalyticsTotalUsersWidget;
  let fixture: ComponentFixture<AnalyticsTotalUsersWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTotalUsersWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsTotalUsersWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
