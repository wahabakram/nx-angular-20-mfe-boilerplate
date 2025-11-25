import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppsPopover } from './apps-popover';

describe('AppsPopover', () => {
  let component: AppsPopover;
  let fixture: ComponentFixture<AppsPopover>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppsPopover]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppsPopover);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
