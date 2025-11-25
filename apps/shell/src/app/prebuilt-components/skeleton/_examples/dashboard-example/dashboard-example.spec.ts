import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardExample } from './dashboard-example';

describe('DashboardExample', () => {
  let component: DashboardExample;
  let fixture: ComponentFixture<DashboardExample>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardExample]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardExample);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
