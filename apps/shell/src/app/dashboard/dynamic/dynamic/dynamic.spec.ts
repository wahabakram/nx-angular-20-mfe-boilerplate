import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dynamic } from './dynamic';

describe('Dynamic', () => {
  let component: Dynamic;
  let fixture: ComponentFixture<Dynamic>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dynamic]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dynamic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
