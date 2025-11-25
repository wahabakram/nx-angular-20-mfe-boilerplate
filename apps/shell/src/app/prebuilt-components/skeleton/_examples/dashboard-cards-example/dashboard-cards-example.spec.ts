import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCardsExample } from './dashboard-cards-example';

describe('DashboardCardsExample', () => {
  let component: DashboardCardsExample;
  let fixture: ComponentFixture<DashboardCardsExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCardsExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCardsExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
