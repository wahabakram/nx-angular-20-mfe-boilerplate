import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessCell } from './access-cell';

describe('AccessCell', () => {
  let component: AccessCell;
  let fixture: ComponentFixture<AccessCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AccessCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccessCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
