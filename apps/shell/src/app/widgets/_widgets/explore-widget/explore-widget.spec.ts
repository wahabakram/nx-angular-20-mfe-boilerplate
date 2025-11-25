import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExploreWidget } from './explore-widget';

describe('ExploreWidget', () => {
  let component: ExploreWidget;
  let fixture: ComponentFixture<ExploreWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExploreWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExploreWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
