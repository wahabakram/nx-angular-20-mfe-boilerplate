import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrafficByLocationWidget } from './traffic-by-location-widget';

describe('TrafficByLocationWidget', () => {
  let component: TrafficByLocationWidget;
  let fixture: ComponentFixture<TrafficByLocationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrafficByLocationWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrafficByLocationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
