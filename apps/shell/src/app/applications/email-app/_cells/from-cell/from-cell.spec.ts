import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromCell } from './from-cell';

describe('FromCell', () => {
  let component: FromCell;
  let fixture: ComponentFixture<FromCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FromCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
