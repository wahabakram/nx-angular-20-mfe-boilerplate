import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersDatatable } from './users-datatable';

describe('UsersDatatable', () => {
  let component: UsersDatatable;
  let fixture: ComponentFixture<UsersDatatable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersDatatable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersDatatable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
