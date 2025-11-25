import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartWidgetSkeleton } from './dashboard-chart-widget-skeleton';

describe('DashboardChartWidgetSkeleton', () => {
  let component: DashboardChartWidgetSkeleton;
  let fixture: ComponentFixture<DashboardChartWidgetSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChartWidgetSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardChartWidgetSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
