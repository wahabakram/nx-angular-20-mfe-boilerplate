import { InjectionToken } from '@angular/core';

export type PopoverTrigger = 'click' | 'hover';
export type PopoverPosition = 'below-start' | 'below-center' | 'below-end' |
                              'above-start' | 'above-center' | 'above-end' |
                              'before-start' | 'before-center' | 'before-end' |
                              'after-start' | 'after-center' | 'after-end';

export const POPOVER_TRIGGER = new InjectionToken<PopoverTrigger>('POPOVER_TRIGGER');
