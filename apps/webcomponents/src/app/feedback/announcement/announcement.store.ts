import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { AnnouncementInterface } from './types';

export interface AnnouncementState {
  announcement: AnnouncementInterface | null;
}

const initialState: AnnouncementState = {
  announcement: null,
};

export const AnnouncementStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withMethods((store) => ({
    show(announcement: AnnouncementInterface): void {
      patchState(store, { announcement });
    },
    hide() {
      patchState(store, { announcement: null });
    }
  }))
);
