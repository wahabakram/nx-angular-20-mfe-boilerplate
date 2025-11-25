import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsTotalProjectsWidget } from './analytics-total-projects-widget';

describe('AnalyticsTotalProjectsWidget', () => {
  let component: AnalyticsTotalProjectsWidget;
  let fixture: ComponentFixture<AnalyticsTotalProjectsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsTotalProjectsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsTotalProjectsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
