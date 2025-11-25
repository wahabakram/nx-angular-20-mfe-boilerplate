import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeNowWidgetExample } from './upgrade-now-widget-example';

describe('UpgradeNowWidgetExample', () => {
  let component: UpgradeNowWidgetExample;
  let fixture: ComponentFixture<UpgradeNowWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeNowWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeNowWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
