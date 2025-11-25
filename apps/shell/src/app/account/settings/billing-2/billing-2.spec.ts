import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Billing2 } from './billing-2';

describe('Billing2', () => {
  let component: Billing2;
  let fixture: ComponentFixture<Billing2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Billing2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Billing2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
