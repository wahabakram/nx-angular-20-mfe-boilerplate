import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCreditCardFormCard } from './add-credit-card-form-card';

describe('AddCreditCardFormCard', () => {
  let component: AddCreditCardFormCard;
  let fixture: ComponentFixture<AddCreditCardFormCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCreditCardFormCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddCreditCardFormCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
