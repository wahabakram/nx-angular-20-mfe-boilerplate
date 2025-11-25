import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoToPremium } from './go-to-premium';

describe('GoToPremium', () => {
  let component: GoToPremium;
  let fixture: ComponentFixture<GoToPremium>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GoToPremium]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GoToPremium);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
