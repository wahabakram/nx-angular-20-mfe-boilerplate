import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficChartWidget } from './traffic-chart-widget';

describe('TrafficChartWidget', () => {
  let component: TrafficChartWidget;
  let fixture: ComponentFixture<TrafficChartWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficChartWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficChartWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
