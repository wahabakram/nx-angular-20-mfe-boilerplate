import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyticsActiveUsersWidget } from './analytics-active-users-widget';

describe('AnalyticsActiveUsersWidget', () => {
  let component: AnalyticsActiveUsersWidget;
  let fixture: ComponentFixture<AnalyticsActiveUsersWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsActiveUsersWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsActiveUsersWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
