import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryUploadComponent } from './itinerary-upload.component';

describe('CertificationsUploadComponent', () => {
  let component: ItineraryUploadComponent;
  let fixture: ComponentFixture<ItineraryUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItineraryUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
