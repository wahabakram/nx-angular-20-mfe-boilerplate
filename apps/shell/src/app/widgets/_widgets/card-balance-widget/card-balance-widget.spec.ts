import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardBalanceWidget } from './card-balance-widget';

describe('CardBalanceWidget', () => {
  let component: CardBalanceWidget;
  let fixture: ComponentFixture<CardBalanceWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardBalanceWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardBalanceWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
