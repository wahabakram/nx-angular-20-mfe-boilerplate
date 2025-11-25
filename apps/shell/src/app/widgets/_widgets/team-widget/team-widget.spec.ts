import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamWidget } from './team-widget';

describe('TeamWidget', () => {
  let component: TeamWidget;
  let fixture: ComponentFixture<TeamWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TeamWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
