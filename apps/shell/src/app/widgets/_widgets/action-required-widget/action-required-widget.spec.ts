import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionRequiredWidget } from './action-required-widget';

describe('ActionRequiredWidget', () => {
  let component: ActionRequiredWidget;
  let fixture: ComponentFixture<ActionRequiredWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionRequiredWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionRequiredWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
