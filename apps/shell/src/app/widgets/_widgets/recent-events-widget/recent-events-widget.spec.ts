import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentEventsWidget } from './recent-events-widget';

describe('RecentEventsWidget', () => {
  let component: RecentEventsWidget;
  let fixture: ComponentFixture<RecentEventsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentEventsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecentEventsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
