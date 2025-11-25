import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeProPlanCard } from './upgrade-pro-plan-card';

describe('UpgradeProPlanCard', () => {
  let component: UpgradeProPlanCard;
  let fixture: ComponentFixture<UpgradeProPlanCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeProPlanCard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpgradeProPlanCard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
