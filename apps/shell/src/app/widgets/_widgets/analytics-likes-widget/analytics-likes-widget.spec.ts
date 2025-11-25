import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsLikesWidget } from './analytics-likes-widget';

describe('AnalyticsLikesWidget', () => {
  let component: AnalyticsLikesWidget;
  let fixture: ComponentFixture<AnalyticsLikesWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsLikesWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsLikesWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
