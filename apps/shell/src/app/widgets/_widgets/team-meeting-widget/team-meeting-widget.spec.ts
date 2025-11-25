import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamMeetingWidget } from './team-meeting-widget';

describe('TeamMeetingWidget', () => {
  let component: TeamMeetingWidget;
  let fixture: ComponentFixture<TeamMeetingWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamMeetingWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamMeetingWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
