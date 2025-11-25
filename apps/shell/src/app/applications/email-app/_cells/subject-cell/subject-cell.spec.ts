import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectCell } from './subject-cell';

describe('SubjectCell', () => {
  let component: SubjectCell;
  let fixture: ComponentFixture<SubjectCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
