import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalOrdersWidget } from './analytics-total-orders-widget';

describe('AnalyticsTotalOrdersWidget', () => {
  let component: AnalyticsTotalOrdersWidget;
  let fixture: ComponentFixture<AnalyticsTotalOrdersWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTotalOrdersWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsTotalOrdersWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
