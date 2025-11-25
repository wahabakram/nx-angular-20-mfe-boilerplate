import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingActionsCell } from './billing-actions-cell';

describe('BillingActionsCell', () => {
  let component: BillingActionsCell;
  let fixture: ComponentFixture<BillingActionsCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingActionsCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingActionsCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
