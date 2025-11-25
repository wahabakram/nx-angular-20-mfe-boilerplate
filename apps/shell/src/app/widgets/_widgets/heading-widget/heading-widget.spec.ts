import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeadingWidget } from './heading-widget';

describe('HeadingWidget', () => {
  let component: HeadingWidget;
  let fixture: ComponentFixture<HeadingWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeadingWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeadingWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
