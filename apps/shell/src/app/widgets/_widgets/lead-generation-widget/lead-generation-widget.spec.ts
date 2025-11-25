import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadGenerationWidget } from './lead-generation-widget';

describe('LeadGenerationWidget', () => {
  let component: LeadGenerationWidget;
  let fixture: ComponentFixture<LeadGenerationWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadGenerationWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadGenerationWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
