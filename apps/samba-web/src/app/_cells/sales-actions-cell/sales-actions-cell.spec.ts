import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SalesActionsCell } from './sales-actions-cell';

describe('SalesActionsCell', () => {
  let component: SalesActionsCell;
  let fixture: ComponentFixture<SalesActionsCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesActionsCell],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesActionsCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
