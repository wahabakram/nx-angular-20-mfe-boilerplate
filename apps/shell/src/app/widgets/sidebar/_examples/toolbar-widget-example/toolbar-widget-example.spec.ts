import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarWidgetExample } from './toolbar-widget-example';

describe('ToolbarWidgetExample', () => {
  let component: ToolbarWidgetExample;
  let fixture: ComponentFixture<ToolbarWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
