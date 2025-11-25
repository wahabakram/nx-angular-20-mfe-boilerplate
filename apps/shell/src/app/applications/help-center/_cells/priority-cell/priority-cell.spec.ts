import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityCell } from './priority-cell';

describe('PriorityCell', () => {
  let component: PriorityCell;
  let fixture: ComponentFixture<PriorityCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriorityCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
