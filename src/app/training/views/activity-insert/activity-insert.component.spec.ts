import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityInsertComponent } from './activity-insert.component';

describe('ActivityInsertComponent', () => {
  let component: ActivityInsertComponent;
  let fixture: ComponentFixture<ActivityInsertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivityInsertComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivityInsertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
