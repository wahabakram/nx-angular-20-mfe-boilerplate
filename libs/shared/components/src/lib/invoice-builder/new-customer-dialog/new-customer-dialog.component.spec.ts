import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewCustomerDialogComponent } from './new-customer-dialog.component';

describe('NewCustomerDialogComponent', () => {
  let component: NewCustomerDialogComponent;
  let fixture: ComponentFixture<NewCustomerDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewCustomerDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewCustomerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
