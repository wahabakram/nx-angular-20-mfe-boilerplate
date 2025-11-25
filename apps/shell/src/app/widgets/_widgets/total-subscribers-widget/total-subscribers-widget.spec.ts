import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalSubscribersWidget } from './total-subscribers-widget';

describe('TotalSubscribersWidget', () => {
  let component: TotalSubscribersWidget;
  let fixture: ComponentFixture<TotalSubscribersWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalSubscribersWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalSubscribersWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
