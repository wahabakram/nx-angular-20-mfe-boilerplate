import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesOverviewWidget } from './sales-overview-widget';

describe('SalesOverviewWidget', () => {
  let component: SalesOverviewWidget;
  let fixture: ComponentFixture<SalesOverviewWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalesOverviewWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesOverviewWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
