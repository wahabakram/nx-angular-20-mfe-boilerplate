import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspacesSelect } from './workspaces-select';

describe('WorkspacesSelect', () => {
  let component: WorkspacesSelect;
  let fixture: ComponentFixture<WorkspacesSelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspacesSelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspacesSelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
