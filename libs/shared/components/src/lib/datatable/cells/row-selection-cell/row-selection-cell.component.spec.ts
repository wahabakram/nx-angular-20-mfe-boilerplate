import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RowSelectionCellComponent } from './row-selection-cell.component';

describe('RowSelectionCellComponent', () => {
  let component: RowSelectionCellComponent;
  let fixture: ComponentFixture<RowSelectionCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RowSelectionCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RowSelectionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
