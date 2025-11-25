import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentStatusCell } from './payment-status-cell';

describe('PaymentStatusCell', () => {
  let component: PaymentStatusCell;
  let fixture: ComponentFixture<PaymentStatusCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentStatusCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentStatusCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
