import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsCommentsWidget } from './analytics-comments-widget';

describe('AnalyticsCommentsWidget', () => {
  let component: AnalyticsCommentsWidget;
  let fixture: ComponentFixture<AnalyticsCommentsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsCommentsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsCommentsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
