import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationsPopover } from './notifications-popover';

describe('NotificationsPopover', () => {
  let component: NotificationsPopover;
  let fixture: ComponentFixture<NotificationsPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationsPopover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NotificationsPopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
