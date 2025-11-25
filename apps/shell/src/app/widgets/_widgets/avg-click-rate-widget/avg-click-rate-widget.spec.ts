import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgClickRateWidget } from './avg-click-rate-widget';

describe('AvgClickRateWidget', () => {
  let component: AvgClickRateWidget;
  let fixture: ComponentFixture<AvgClickRateWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgClickRateWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvgClickRateWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
