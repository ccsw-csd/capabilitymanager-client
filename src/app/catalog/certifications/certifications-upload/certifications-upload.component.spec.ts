import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificationsUploadComponent } from './certifications-upload.component';

describe('CertificationsUploadComponent', () => {
  let component: CertificationsUploadComponent;
  let fixture: ComponentFixture<CertificationsUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CertificationsUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificationsUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
