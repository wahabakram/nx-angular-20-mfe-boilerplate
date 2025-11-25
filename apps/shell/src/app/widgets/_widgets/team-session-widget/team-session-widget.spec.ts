import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamSessionWidget } from './team-session-widget';

describe('TeamSessionWidget', () => {
  let component: TeamSessionWidget;
  let fixture: ComponentFixture<TeamSessionWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamSessionWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamSessionWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
