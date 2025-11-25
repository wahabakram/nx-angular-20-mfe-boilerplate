import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToEditorFilesInFolderNotificationExample } from './invite-to-editor-files-in-folder-notification-example';

describe('InviteToEditorFilesInFolderNotificationExample', () => {
  let component: InviteToEditorFilesInFolderNotificationExample;
  let fixture: ComponentFixture<InviteToEditorFilesInFolderNotificationExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteToEditorFilesInFolderNotificationExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteToEditorFilesInFolderNotificationExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
