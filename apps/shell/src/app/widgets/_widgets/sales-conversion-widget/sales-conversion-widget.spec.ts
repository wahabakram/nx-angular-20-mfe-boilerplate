import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesConversionWidget } from './sales-conversion-widget';

describe('SalesConversionWidget', () => {
  let component: SalesConversionWidget;
  let fixture: ComponentFixture<SalesConversionWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesConversionWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesConversionWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
