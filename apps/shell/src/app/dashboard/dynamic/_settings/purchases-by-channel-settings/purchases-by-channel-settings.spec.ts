import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasesByChannelSettings } from './purchases-by-channel-settings';

describe('PurchasesByChannelSettings', () => {
  let component: PurchasesByChannelSettings;
  let fixture: ComponentFixture<PurchasesByChannelSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PurchasesByChannelSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchasesByChannelSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
