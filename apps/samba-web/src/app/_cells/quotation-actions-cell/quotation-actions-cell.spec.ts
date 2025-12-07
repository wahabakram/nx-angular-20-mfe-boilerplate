import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotationActionsCell } from './quotation-actions-cell';

describe('QuotationActionsCell', () => {
  let component: QuotationActionsCell;
  let fixture: ComponentFixture<QuotationActionsCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuotationActionsCell],
    }).compileComponents();

    fixture = TestBed.createComponent(QuotationActionsCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
