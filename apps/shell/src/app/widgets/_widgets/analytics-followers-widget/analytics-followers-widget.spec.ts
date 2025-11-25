import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsFollowersWidget } from './analytics-followers-widget';

describe('AnalyticsFollowersWidget', () => {
  let component: AnalyticsFollowersWidget;
  let fixture: ComponentFixture<AnalyticsFollowersWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsFollowersWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsFollowersWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
