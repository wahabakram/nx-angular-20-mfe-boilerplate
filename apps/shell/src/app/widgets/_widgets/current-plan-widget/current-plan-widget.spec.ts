import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentPlanWidget } from './current-plan-widget';

describe('CurrentPlanWidget', () => {
  let component: CurrentPlanWidget;
  let fixture: ComponentFixture<CurrentPlanWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentPlanWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CurrentPlanWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
