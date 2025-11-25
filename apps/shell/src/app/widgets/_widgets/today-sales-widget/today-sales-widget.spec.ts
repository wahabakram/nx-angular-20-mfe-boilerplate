import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaySalesWidget } from './today-sales-widget';

describe('TodaySalesWidget', () => {
  let component: TodaySalesWidget;
  let fixture: ComponentFixture<TodaySalesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodaySalesWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TodaySalesWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
