import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTasksWidget } from './total-tasks-widget';

describe('TotalTasksWidget', () => {
  let component: TotalTasksWidget;
  let fixture: ComponentFixture<TotalTasksWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTasksWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TotalTasksWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
