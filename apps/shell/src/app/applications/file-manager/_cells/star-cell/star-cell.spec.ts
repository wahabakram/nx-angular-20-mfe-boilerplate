import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StarCell } from './star-cell';

describe('StarCell', () => {
  let component: StarCell;
  let fixture: ComponentFixture<StarCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StarCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StarCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
