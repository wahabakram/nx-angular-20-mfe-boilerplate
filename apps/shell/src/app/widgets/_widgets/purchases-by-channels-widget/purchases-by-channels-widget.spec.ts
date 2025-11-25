import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesByChannelsWidget } from './purchases-by-channels-widget';

describe('PurchasesByChannelsWidget', () => {
  let component: PurchasesByChannelsWidget;
  let fixture: ComponentFixture<PurchasesByChannelsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesByChannelsWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchasesByChannelsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
