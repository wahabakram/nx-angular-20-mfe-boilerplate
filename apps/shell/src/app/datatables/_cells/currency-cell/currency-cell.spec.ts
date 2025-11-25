import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyCell } from './currency-cell';

describe('CurrencyCell', () => {
  let component: CurrencyCell;
  let fixture: ComponentFixture<CurrencyCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrencyCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrencyCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
