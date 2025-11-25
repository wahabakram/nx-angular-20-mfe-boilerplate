import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionsOverviewWidget } from './transactions-overview-widget';

describe('TransactionsOverviewWidget', () => {
  let component: TransactionsOverviewWidget;
  let fixture: ComponentFixture<TransactionsOverviewWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsOverviewWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionsOverviewWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
