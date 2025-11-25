import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeNow } from './upgrade-now';

describe('UpgradeNow', () => {
  let component: UpgradeNow;
  let fixture: ComponentFixture<UpgradeNow>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeNow]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpgradeNow);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
