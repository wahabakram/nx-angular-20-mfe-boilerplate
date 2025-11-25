import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardChartExample } from './dashboard-chart-example';

describe('DashboardChartExample', () => {
  let component: DashboardChartExample;
  let fixture: ComponentFixture<DashboardChartExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardChartExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardChartExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
