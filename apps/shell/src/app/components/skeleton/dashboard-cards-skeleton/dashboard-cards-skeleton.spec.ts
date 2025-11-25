import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardsSkeleton } from './dashboard-cards-skeleton';

describe('DashboardCardsSkeleton', () => {
  let component: DashboardCardsSkeleton;
  let fixture: ComponentFixture<DashboardCardsSkeleton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardsSkeleton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardsSkeleton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
