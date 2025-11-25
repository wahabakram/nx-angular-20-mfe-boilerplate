import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalProjectsWidget } from './total-projects-widget';

describe('TotalProjectsWidget', () => {
  let component: TotalProjectsWidget;
  let fixture: ComponentFixture<TotalProjectsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalProjectsWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalProjectsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
