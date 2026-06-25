import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckbox } from './form-checkbox';

describe('FormCheckbox', () => {
  let component: FormCheckbox;
  let fixture: ComponentFixture<FormCheckbox>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCheckbox],
    }).compileComponents();

    fixture = TestBed.createComponent(FormCheckbox);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
