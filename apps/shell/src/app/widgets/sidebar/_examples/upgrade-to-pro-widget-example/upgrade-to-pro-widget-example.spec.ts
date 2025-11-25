import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeToProWidgetExample } from './upgrade-to-pro-widget-example';

describe('UpgradeToProWidgetExample', () => {
  let component: UpgradeToProWidgetExample;
  let fixture: ComponentFixture<UpgradeToProWidgetExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeToProWidgetExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeToProWidgetExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
