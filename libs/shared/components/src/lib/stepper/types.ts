import { Step } from './step';

export interface StepperSelectionEvent {
  previouslySelectedIndex: number;
  previouslySelectedStep: Step | undefined;
  selectedIndex: number;
  selectedStep: Step;
}
