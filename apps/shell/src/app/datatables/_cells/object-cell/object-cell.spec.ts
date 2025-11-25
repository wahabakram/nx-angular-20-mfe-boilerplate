import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectCell } from './object-cell';

describe('ObjectCell', () => {
  let component: ObjectCell;
  let fixture: ComponentFixture<ObjectCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObjectCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObjectCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
