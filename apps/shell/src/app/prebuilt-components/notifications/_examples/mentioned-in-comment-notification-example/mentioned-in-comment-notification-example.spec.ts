import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MentionedInCommentNotificationExample } from './mentioned-in-comment-notification-example';

describe('MentionedInCommentNotificationExample', () => {
  let component: MentionedInCommentNotificationExample;
  let fixture: ComponentFixture<MentionedInCommentNotificationExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MentionedInCommentNotificationExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MentionedInCommentNotificationExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
