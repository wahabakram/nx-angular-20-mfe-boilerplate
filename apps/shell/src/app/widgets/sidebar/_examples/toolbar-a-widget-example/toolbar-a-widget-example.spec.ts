import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarAWidgetExample } from './toolbar-a-widget-example';

describe('ToolbarAWidgetExample', () => {
  let component: ToolbarAWidgetExample;
  let fixture: ComponentFixture<ToolbarAWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolbarAWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarAWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
