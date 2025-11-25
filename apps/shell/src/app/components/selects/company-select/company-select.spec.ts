import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanySelect } from './company-select';

describe('CompanySelect', () => {
  let component: CompanySelect;
  let fixture: ComponentFixture<CompanySelect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanySelect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanySelect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
