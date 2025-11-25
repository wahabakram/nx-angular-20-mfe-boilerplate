import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentInformationWidget } from './payment-information-widget';

describe('PaymentInformationWidget', () => {
  let component: PaymentInformationWidget;
  let fixture: ComponentFixture<PaymentInformationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentInformationWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentInformationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
