import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvAuthorRenderer } from './dv-author-renderer';

describe('DvAuthorRenderer', () => {
  let component: DvAuthorRenderer;
  let fixture: ComponentFixture<DvAuthorRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DvAuthorRenderer]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DvAuthorRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
