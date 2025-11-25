import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SprintMeetingWidget } from './sprint-meeting-widget';

describe('SprintMeetingWidget', () => {
  let component: SprintMeetingWidget;
  let fixture: ComponentFixture<SprintMeetingWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SprintMeetingWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SprintMeetingWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
