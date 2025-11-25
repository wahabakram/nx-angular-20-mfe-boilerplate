import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteToProjectDialog } from './invite-to-project.dialog';

describe('InviteToProjectDialog', () => {
  let component: InviteToProjectDialog;
  let fixture: ComponentFixture<InviteToProjectDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InviteToProjectDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InviteToProjectDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
