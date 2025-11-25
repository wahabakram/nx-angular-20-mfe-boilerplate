import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalProjectsSettings } from './total-projects-settings';

describe('TotalProjectsSettings', () => {
  let component: TotalProjectsSettings;
  let fixture: ComponentFixture<TotalProjectsSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalProjectsSettings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalProjectsSettings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
