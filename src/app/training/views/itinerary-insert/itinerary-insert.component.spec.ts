import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItineraryInsertComponent } from './itinerary-insert.component';

describe('ItineraryInsertComponent', () => {
  let component: ItineraryInsertComponent;
  let fixture: ComponentFixture<ItineraryInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ItineraryInsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItineraryInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
