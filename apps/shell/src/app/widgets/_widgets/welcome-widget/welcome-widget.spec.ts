import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeWidget } from './welcome-widget';

describe('WelcomeWidget', () => {
  let component: WelcomeWidget;
  let fixture: ComponentFixture<WelcomeWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
