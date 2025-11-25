import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserCell } from './user-cell';

describe('UserCell', () => {
  let component: UserCell;
  let fixture: ComponentFixture<UserCell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserCell]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserCell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
