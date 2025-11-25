import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitDurationWidget } from './visit-duration-widget';

describe('VisitDurationWidget', () => {
  let component: VisitDurationWidget;
  let fixture: ComponentFixture<VisitDurationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitDurationWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitDurationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
