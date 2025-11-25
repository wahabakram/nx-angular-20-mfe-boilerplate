import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsGrossRevenueWidget } from './analytics-gross-revenue-widget';

describe('AnalyticsGrossRevenueWidget', () => {
  let component: AnalyticsGrossRevenueWidget;
  let fixture: ComponentFixture<AnalyticsGrossRevenueWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsGrossRevenueWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsGrossRevenueWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
