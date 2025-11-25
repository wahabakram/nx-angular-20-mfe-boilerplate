import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkspaceSelectExample } from './workspace-select-example';

describe('WorkspaceSelectExample', () => {
  let component: WorkspaceSelectExample;
  let fixture: ComponentFixture<WorkspaceSelectExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkspaceSelectExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkspaceSelectExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
