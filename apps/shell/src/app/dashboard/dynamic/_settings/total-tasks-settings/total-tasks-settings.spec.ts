import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalTasksSettings } from './total-tasks-settings';

describe('TotalTasksSettings', () => {
  let component: TotalTasksSettings;
  let fixture: ComponentFixture<TotalTasksSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalTasksSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalTasksSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
