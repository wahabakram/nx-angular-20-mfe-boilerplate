import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsPendingProjectsWidget } from './analytics-pending-projects-widget';

describe('AnalyticsPendingProjectsWidget', () => {
  let component: AnalyticsPendingProjectsWidget;
  let fixture: ComponentFixture<AnalyticsPendingProjectsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsPendingProjectsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsPendingProjectsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
