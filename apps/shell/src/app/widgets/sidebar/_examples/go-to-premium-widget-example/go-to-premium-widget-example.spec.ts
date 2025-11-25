import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToPremiumWidgetExample } from './go-to-premium-widget-example';

describe('GoToPremiumWidgetExample', () => {
  let component: GoToPremiumWidgetExample;
  let fixture: ComponentFixture<GoToPremiumWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoToPremiumWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GoToPremiumWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
