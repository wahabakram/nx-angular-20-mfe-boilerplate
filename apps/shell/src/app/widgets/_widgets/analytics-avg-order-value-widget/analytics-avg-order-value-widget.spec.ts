import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsAvgOrderValueWidget } from './analytics-avg-order-value-widget';

describe('AnalyticsAvgOrderValueWidget', () => {
  let component: AnalyticsAvgOrderValueWidget;
  let fixture: ComponentFixture<AnalyticsAvgOrderValueWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsAvgOrderValueWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsAvgOrderValueWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
