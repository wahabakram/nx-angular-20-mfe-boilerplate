import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardCell } from './credit-card-cell';

describe('CreditCardCell', () => {
  let component: CreditCardCell;
  let fixture: ComponentFixture<CreditCardCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditCardCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditCardCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
