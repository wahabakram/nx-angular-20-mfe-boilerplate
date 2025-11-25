import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSatisfactionWidget } from './customer-satisfaction-widget';

describe('CustomerSatisfactionWidget', () => {
  let component: CustomerSatisfactionWidget;
  let fixture: ComponentFixture<CustomerSatisfactionWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerSatisfactionWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CustomerSatisfactionWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
