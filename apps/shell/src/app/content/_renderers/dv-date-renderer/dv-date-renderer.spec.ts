import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DvDateRenderer } from './dv-date-renderer';

describe('DvDateRenderer', () => {
  let component: DvDateRenderer;
  let fixture: ComponentFixture<DvDateRenderer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DvDateRenderer]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DvDateRenderer);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
