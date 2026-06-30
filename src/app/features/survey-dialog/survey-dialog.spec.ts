import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyDialog } from './survey-dialog';

describe('SurveyDialog', () => {
  let component: SurveyDialog;
  let fixture: ComponentFixture<SurveyDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('keeps the survey title control invalid and shows the validation state after submit', () => {
  //   component.formSubmit();
  //   fixture.detectChanges();

  //   const surveyTitleControl = component.surveyForm.controls.survey_title;
  //   const compiled = fixture.nativeElement as HTMLElement;
  //   const titleInput = compiled.querySelector('#survey-title') as HTMLInputElement | null;
  //   const errorMessage = compiled.querySelector('#survey-title-error');

  //   expect(surveyTitleControl.invalid).toBe(true);
  //   expect(surveyTitleControl.value).toBe('');
  //   expect(component.surveyTitleInvalid).toBe(true);
  //   expect(titleInput?.placeholder).toBe(component.surveyValidationErrors.survey_title);
  //   expect(errorMessage?.textContent?.trim()).toBe(component.surveyValidationErrors.survey_title);
  // });
});
