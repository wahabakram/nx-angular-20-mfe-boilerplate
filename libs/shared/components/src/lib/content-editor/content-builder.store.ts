import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ContentEditorDataBlock } from './types';

type ContentBuilderState = {
  focusedBlockId: string | null;
  activeBlockId: string | null;
  dataBlocks: ContentEditorDataBlock[]
};

const initialState: ContentBuilderState = {
  focusedBlockId: null,
  activeBlockId: null,
  dataBlocks: []
};

export const ContentBuilderStore = signalStore(
  withState(initialState),
  withMethods((store) => ({
    setFocusedBlockId(focusedBlockId: string | null): void {
      patchState(store, (state) => ({ focusedBlockId }));
    },
    setActiveBlockId(activeBlockId: string | null): void {
      patchState(store, (state) => ({ activeBlockId }));
    },
    addDataBlock(dataBlock: ContentEditorDataBlock): void {
      patchState(store, (state) => {
        state.dataBlocks.push(dataBlock);
        return {
          ...state
        }
      });
    },
  }))
);
