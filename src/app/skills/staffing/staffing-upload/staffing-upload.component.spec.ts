import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffingUploadComponent } from './staffing-upload.component';

describe('StaffingUploadComponent', () => {
  let component: StaffingUploadComponent;
  let fixture: ComponentFixture<StaffingUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StaffingUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StaffingUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
