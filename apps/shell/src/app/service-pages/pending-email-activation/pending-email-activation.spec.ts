import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingEmailActivation } from './pending-email-activation';

describe('PendingEmailActivation', () => {
  let component: PendingEmailActivation;
  let fixture: ComponentFixture<PendingEmailActivation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingEmailActivation]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PendingEmailActivation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
