import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalEditComponent } from './personal-edit.component';

describe('PersonalEditComponent', () => {
  let component: PersonalEditComponent;
  let fixture: ComponentFixture<PersonalEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
