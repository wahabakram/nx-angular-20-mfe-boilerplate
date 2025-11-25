import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadSelectionCellComponent } from './head-selection-cell.component';

describe('HeadSelectionCellComponent', () => {
  let component: HeadSelectionCellComponent;
  let fixture: ComponentFixture<HeadSelectionCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadSelectionCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadSelectionCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
