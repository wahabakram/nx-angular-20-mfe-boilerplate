import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UniqueVisitorsWidget } from './unique-visitors-widget';

describe('UniqueVisitorsWidget', () => {
  let component: UniqueVisitorsWidget;
  let fixture: ComponentFixture<UniqueVisitorsWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UniqueVisitorsWidget]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UniqueVisitorsWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
