import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductiveTimeWidget } from './productive-time-widget';

describe('ProductiveTimeWidget', () => {
  let component: ProductiveTimeWidget;
  let fixture: ComponentFixture<ProductiveTimeWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductiveTimeWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductiveTimeWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
