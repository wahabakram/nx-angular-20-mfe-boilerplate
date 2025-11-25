import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsRunningProjectsWidget } from './analytics-running-projects-widget';

describe('AnalyticsRunningProjectsWidget', () => {
  let component: AnalyticsRunningProjectsWidget;
  let fixture: ComponentFixture<AnalyticsRunningProjectsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsRunningProjectsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsRunningProjectsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
