import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalentProfile } from './talent-profile';

describe('TalentProfile', () => {
  let component: TalentProfile;
  let fixture: ComponentFixture<TalentProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalentProfile]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TalentProfile);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
