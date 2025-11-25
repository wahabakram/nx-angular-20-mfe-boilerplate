import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyLimitWidget } from './daily-limit-widget';

describe('DailyLimitWidget', () => {
  let component: DailyLimitWidget;
  let fixture: ComponentFixture<DailyLimitWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DailyLimitWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DailyLimitWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
