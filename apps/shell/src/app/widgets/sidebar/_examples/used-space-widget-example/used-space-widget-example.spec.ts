import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedSpaceWidgetExample } from './used-space-widget-example';

describe('UsedSpaceWidgetExample', () => {
  let component: UsedSpaceWidgetExample;
  let fixture: ComponentFixture<UsedSpaceWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedSpaceWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsedSpaceWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
