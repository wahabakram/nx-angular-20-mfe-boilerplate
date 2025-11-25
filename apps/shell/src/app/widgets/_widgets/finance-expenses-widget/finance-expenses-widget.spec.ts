import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceExpensesWidget } from './finance-expenses-widget';

describe('FinanceExpensesWidget', () => {
  let component: FinanceExpensesWidget;
  let fixture: ComponentFixture<FinanceExpensesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceExpensesWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceExpensesWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
