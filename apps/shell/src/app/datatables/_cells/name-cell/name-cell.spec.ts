import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameCell } from './name-cell';

describe('NameCell', () => {
  let component: NameCell;
  let fixture: ComponentFixture<NameCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NameCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NameCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
