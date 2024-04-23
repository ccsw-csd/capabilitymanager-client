import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CapabilitiesUploadComponent } from './capabilities-upload.component';

describe('CapabilitiesUploadComponent', () => {
  let component: CapabilitiesUploadComponent;
  let fixture: ComponentFixture<CapabilitiesUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CapabilitiesUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CapabilitiesUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
