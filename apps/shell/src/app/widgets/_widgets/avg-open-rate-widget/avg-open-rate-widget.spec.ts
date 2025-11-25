import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgOpenRateWidget } from './avg-open-rate-widget';

describe('AvgOpenRateWidget', () => {
  let component: AvgOpenRateWidget;
  let fixture: ComponentFixture<AvgOpenRateWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvgOpenRateWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AvgOpenRateWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
