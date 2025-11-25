import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeToPro } from './upgrade-to-pro';

describe('UpgradeToPro', () => {
  let component: UpgradeToPro;
  let fixture: ComponentFixture<UpgradeToPro>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpgradeToPro]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UpgradeToPro);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
