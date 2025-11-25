import { booleanAttribute, Component, input } from '@angular/core';
import { DataViewActionBarAPI } from '../types';

@Component({
  selector: 'mf-data-view-action-bar',
  exportAs: 'mfDataViewActionBar',
  templateUrl: './data-view-action-bar.html',
  styleUrl: './data-view-action-bar.scss',
  host: {
    class: 'mf-data-view-action-bar',
    '[class.force-visible]': 'forceVisible() || _forceVisible',
  },
})
export class DataViewActionBar {
  forceVisible = input(false, {
    transform: booleanAttribute,
  });
  protected _forceVisible = false;

  get api(): DataViewActionBarAPI {
    return {
      setForceVisible: (forceVisible: boolean): void => {
        this._forceVisible = forceVisible;
      },
    };
  }
}
