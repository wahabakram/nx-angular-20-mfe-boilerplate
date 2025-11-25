import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsedSpace } from './used-space';

describe('UsedSpace', () => {
  let component: UsedSpace;
  let fixture: ComponentFixture<UsedSpace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsedSpace]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsedSpace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
