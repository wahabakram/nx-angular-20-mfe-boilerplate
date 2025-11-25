import { Component, computed, inject, output } from '@angular/core';
import { AnnouncementStore } from '../announcement.store';
import { AnnouncementInterface } from '../types';
import { Announcement } from '../announcement/announcement';

@Component({
  selector: 'mf-announcement-global',
  exportAs: 'mfAnnouncementGlobal',
  imports: [
    Announcement
  ],
  templateUrl: './announcement-global.html',
  styleUrl: './announcement-global.scss'
})
export class AnnouncementGlobal {
  private _announcementStore = inject(AnnouncementStore);

  announcement = computed<AnnouncementInterface | null>(() => {
    return this._announcementStore.announcement();
  });

  readonly announcementClose = output<void>();

  onClose() {
    this._announcementStore.hide();
  }
}
