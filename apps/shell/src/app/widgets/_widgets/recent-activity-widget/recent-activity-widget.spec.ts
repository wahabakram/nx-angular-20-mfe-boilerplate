import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecentActivityWidget } from './recent-activity-widget';

describe('RecentActivityWidget', () => {
  let component: RecentActivityWidget;
  let fixture: ComponentFixture<RecentActivityWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecentActivityWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RecentActivityWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
