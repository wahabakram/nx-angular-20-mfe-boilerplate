import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsEndedProjectsWidget } from './analytics-ended-projects-widget';

describe('AnalyticsEndedProjectsWidget', () => {
  let component: AnalyticsEndedProjectsWidget;
  let fixture: ComponentFixture<AnalyticsEndedProjectsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsEndedProjectsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsEndedProjectsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
