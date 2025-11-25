import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerReviewsCard } from './customer-reviews-card';

describe('CustomerReviewsCard', () => {
  let component: CustomerReviewsCard;
  let fixture: ComponentFixture<CustomerReviewsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerReviewsCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerReviewsCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
