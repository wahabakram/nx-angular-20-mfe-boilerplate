import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCardNumberCellComponent } from './billing-card-number-cell';

describe('BillingCardNumberCellComponent', () => {
  let component: BillingCardNumberCellComponent;
  let fixture: ComponentFixture<BillingCardNumberCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingCardNumberCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingCardNumberCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
