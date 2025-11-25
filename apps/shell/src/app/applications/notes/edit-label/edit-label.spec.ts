import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLabel } from './edit-label';

describe('EditLabel', () => {
  let component: EditLabel;
  let fixture: ComponentFixture<EditLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditLabel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditLabel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
