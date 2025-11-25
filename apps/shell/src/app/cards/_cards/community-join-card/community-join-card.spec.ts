import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityJoinCard } from './community-join-card';

describe('CommunityJoinCard', () => {
  let component: CommunityJoinCard;
  let fixture: ComponentFixture<CommunityJoinCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityJoinCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommunityJoinCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
