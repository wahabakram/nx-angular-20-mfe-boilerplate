import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EngagementWidget } from './engagement-widget';

describe('EngagementWidget', () => {
  let component: EngagementWidget;
  let fixture: ComponentFixture<EngagementWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EngagementWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EngagementWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
