import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsNewSignupsWidget } from './analytics-new-signups-widget';

describe('AnalyticsNewSignupsWidget', () => {
  let component: AnalyticsNewSignupsWidget;
  let fixture: ComponentFixture<AnalyticsNewSignupsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsNewSignupsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsNewSignupsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
