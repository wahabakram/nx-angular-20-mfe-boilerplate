import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventFormDialog } from './event-form-dialog';

describe('EventFormDialog', () => {
  let component: EventFormDialog;
  let fixture: ComponentFixture<EventFormDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventFormDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventFormDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
