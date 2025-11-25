import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonStatsWidget } from './common-stats.widget';

describe('CommonStatsWidget', () => {
  let component: CommonStatsWidget;
  let fixture: ComponentFixture<CommonStatsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonStatsWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonStatsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
