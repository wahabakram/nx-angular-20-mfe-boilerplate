import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardStatsWidgetSkeleton } from './dashboard-stats-widget-skeleton';

describe('DashboardStatsWidgetSkeleton', () => {
  let component: DashboardStatsWidgetSkeleton;
  let fixture: ComponentFixture<DashboardStatsWidgetSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardStatsWidgetSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardStatsWidgetSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
