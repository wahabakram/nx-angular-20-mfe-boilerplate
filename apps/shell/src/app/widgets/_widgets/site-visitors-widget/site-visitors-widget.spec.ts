import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteVisitorsWidget } from './site-visitors-widget';

describe('SiteVisitorsWidget', () => {
  let component: SiteVisitorsWidget;
  let fixture: ComponentFixture<SiteVisitorsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteVisitorsWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SiteVisitorsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
