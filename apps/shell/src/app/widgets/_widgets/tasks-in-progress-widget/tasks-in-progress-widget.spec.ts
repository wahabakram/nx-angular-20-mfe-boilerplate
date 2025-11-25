import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TasksInProgressWidget } from './tasks-in-progress-widget';

describe('TasksInProgressWidget', () => {
  let component: TasksInProgressWidget;
  let fixture: ComponentFixture<TasksInProgressWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksInProgressWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TasksInProgressWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
