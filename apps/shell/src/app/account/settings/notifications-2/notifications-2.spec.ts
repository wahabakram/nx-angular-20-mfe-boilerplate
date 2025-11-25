import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notifications2 } from './notifications-2';

describe('Notifications2', () => {
  let component: Notifications2;
  let fixture: ComponentFixture<Notifications2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notifications2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Notifications2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
