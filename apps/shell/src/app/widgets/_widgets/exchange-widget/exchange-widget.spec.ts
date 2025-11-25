import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeWidget } from './exchange-widget';

describe('ExchangeWidget', () => {
  let component: ExchangeWidget;
  let fixture: ComponentFixture<ExchangeWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExchangeWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ExchangeWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
