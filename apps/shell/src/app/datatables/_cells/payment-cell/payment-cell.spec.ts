import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentCell } from './payment-cell';

describe('PaymentCell', () => {
  let component: PaymentCell;
  let fixture: ComponentFixture<PaymentCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaymentCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
