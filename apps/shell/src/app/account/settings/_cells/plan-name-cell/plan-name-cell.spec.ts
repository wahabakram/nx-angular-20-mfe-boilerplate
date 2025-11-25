import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanNameCellComponent } from './plan-name-cell';

describe('PlanNameCellComponent', () => {
  let component: PlanNameCellComponent;
  let fixture: ComponentFixture<PlanNameCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanNameCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanNameCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
