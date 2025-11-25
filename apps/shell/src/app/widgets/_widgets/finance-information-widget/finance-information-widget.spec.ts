import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanceInformationWidget } from './finance-information-widget';

describe('FinanceInformationWidget', () => {
  let component: FinanceInformationWidget;
  let fixture: ComponentFixture<FinanceInformationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanceInformationWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanceInformationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
