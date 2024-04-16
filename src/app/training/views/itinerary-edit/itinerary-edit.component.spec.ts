import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryEditComponent } from './itinerary-edit.component';

describe('ItineraryEditComponent', () => {
  let component: ItineraryEditComponent;
  let fixture: ComponentFixture<ItineraryEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItineraryEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
