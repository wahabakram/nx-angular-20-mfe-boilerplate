import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingStatusCellComponent } from './billing-status-cell';

describe('BillingStatusCellComponent', () => {
  let component: BillingStatusCellComponent;
  let fixture: ComponentFixture<BillingStatusCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingStatusCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillingStatusCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
