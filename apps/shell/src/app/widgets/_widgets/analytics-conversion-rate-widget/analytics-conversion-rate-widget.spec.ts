import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsConversionRateWidget } from './analytics-conversion-rate-widget';

describe('AnalyticsConversionRateWidget', () => {
  let component: AnalyticsConversionRateWidget;
  let fixture: ComponentFixture<AnalyticsConversionRateWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsConversionRateWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsConversionRateWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
