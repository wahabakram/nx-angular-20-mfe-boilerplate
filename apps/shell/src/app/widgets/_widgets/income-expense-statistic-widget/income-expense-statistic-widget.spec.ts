import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeExpenseStatisticWidget } from './income-expense-statistic-widget';

describe('IncomeExpenseStatisticWidget', () => {
  let component: IncomeExpenseStatisticWidget;
  let fixture: ComponentFixture<IncomeExpenseStatisticWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncomeExpenseStatisticWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeExpenseStatisticWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
