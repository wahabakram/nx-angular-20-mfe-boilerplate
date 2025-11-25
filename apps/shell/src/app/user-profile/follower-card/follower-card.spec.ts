import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowerCard } from './follower-card';

describe('FollowerCard', () => {
  let component: FollowerCard;
  let fixture: ComponentFixture<FollowerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FollowerCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FollowerCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
