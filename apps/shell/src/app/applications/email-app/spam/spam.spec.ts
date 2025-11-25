import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Spam } from './spam';

describe('Spam', () => {
  let component: Spam;
  let fixture: ComponentFixture<Spam>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Spam]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Spam);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
