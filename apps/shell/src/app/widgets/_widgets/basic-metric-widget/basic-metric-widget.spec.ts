import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicMetricWidget } from './basic-metric-widget';

describe('BasicMetricWidget', () => {
  let component: BasicMetricWidget;
  let fixture: ComponentFixture<BasicMetricWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicMetricWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicMetricWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
