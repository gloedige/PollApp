import { Component } from '@angular/core';
import { Button } from '../../shared/components/button/button';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';
import { DialogQuestionOptionBlock } from '../components/dialog-question-option-block/dialog-question-option-block';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";


type OptionGroup = FormGroup<{
  text: FormControl<string>
}>;

type QuestionGroup = FormGroup<{
  title: FormControl<string>;
  multiple: FormControl<boolean>;
  options: FormArray<OptionGroup>;
}>;

type SurveyForm = FormGroup<{
  survey_title: FormControl<string>;
  description: FormControl<string>;
  expiry_date: FormControl<string>;
  category: FormControl<string>;
  questions: FormArray<QuestionGroup>;
}>;

//TODO: create tests for user interaction with the dialog.
@Component({
  selector: 'app-survey-dialog',
  imports: [Button, CategoryMenu, DialogQuestionOptionBlock, ReactiveFormsModule],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
})

export class SurveyDialog {
  surveyForm: SurveyForm = new FormGroup({
    survey_title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.minLength(10)]
    }),
    expiry_date: new FormControl('', {
      nonNullable: true
    }),
    category: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required]
    }),
    questions: new FormArray<QuestionGroup>([])
  });

  submitted = false;

  surveyValidationErrors = {
    survey_title: 'Please enter a valid survey title.',
    category: 'Please select a category.',
    questions: 'Please enter a valid question title.',
    options: 'Please enter a valid option text.'
  };

  get questions(): FormArray<QuestionGroup> {
    return this.surveyForm.controls.questions;
  }

  get formCategory(): FormControl<string> {
    return this.surveyForm.controls.category;
  }

  get surveyTitleInvalid(): boolean {
    const titleControl = this.surveyForm.controls.survey_title;
    return titleControl.invalid && (titleControl.touched || this.submitted);
  }

  /**
   * This function is called when the component is initialized. It adds an initial question to the survey form by calling the addQuestion method.
   */
  ngOnInit() {
    this.addQuestion();
  }

  /**
   * This function adds a new question to the questions FormArray. It creates a new FormGroup for the question with title, multiple, 
   * and options controls, and pushes it to the questions array. This allows users to dynamically add questions to the survey dialog.
   */
  addQuestion(): void {
    this.questions.push(
      new FormGroup({
        title: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
        multiple: new FormControl(false, { nonNullable: true }),
        options: new FormArray([
          new FormGroup({ text: new FormControl('', { nonNullable: true, validators: [Validators.required] }) }),
          new FormGroup({ text: new FormControl('', { nonNullable: true, validators: [Validators.required] }) }),
        ]),
      })
    );
  }

  /**
   * This function is called when the survey form is submitted. It checks if the form is valid and handles the form submission accordingly.
   */
  formSubmit() {
    this.submitted = true;
    this.surveyForm.markAllAsTouched();
    console.log('Title Error:', this.surveyForm.controls.survey_title.errors);
    console.log('Form submitted:', this.surveyForm.value);
    if (this.surveyForm.valid) {
      // Handle form submission
    }
  }

  getInputErrorMessage(controlName: string): string | null {
    const control = this.surveyForm.get(controlName);
    if (control && control.invalid && (control.touched || this.submitted)) {
      if (control.errors?.['required']) {
        return `Please enter a valid ${controlName.replace('_', ' ')}.`;
      }
      if (control.errors?.['minlength']) {
        const requiredLength = control.errors['minlength'].requiredLength;
        return `${controlName.replace('_', ' ')} must be at least ${requiredLength} characters long.`;
      }
    }
    return null;
  }

  validateSurveyTitle(surveyForm: SurveyForm): boolean {
    return (surveyForm.get('survey_title')?.invalid || false);
  }

  validateSurveyDescription(surveyForm: SurveyForm): boolean {
    return (surveyForm.get('description')?.invalid && surveyForm.get('description')?.touched) || false;
  }
}
