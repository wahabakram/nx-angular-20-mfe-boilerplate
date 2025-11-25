import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogoutCard } from './user-logout-card';

describe('UserLogoutCard', () => {
  let component: UserLogoutCard;
  let fixture: ComponentFixture<UserLogoutCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserLogoutCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserLogoutCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
