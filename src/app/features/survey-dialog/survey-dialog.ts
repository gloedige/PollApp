import { Component, inject, Renderer2, signal } from '@angular/core';
import { SupabaseService } from '../services/supabase-service';
import { DOCUMENT} from '@angular/common';
import { Button } from '../../shared/components/button/button';
import { CategoryMenu } from '../../shared/components/category-menu/category-menu';
import { DialogQuestionOptionBlock } from '../components/dialog-question-option-block/dialog-question-option-block';
import {FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import { SurveyService } from '../services/survey-service';
import { getValidationMessage } from '../../shared/utils/validation-messages.util';
import { SurveyForm, QuestionGroup } from '../interfaces/survey-form';
import { Router } from '@angular/router';
import {InfoOverlay} from "../../shared/components/info-overlay/info-overlay";

@Component({
  selector: 'app-survey-dialog',
  imports: [Button, CategoryMenu, DialogQuestionOptionBlock, ReactiveFormsModule, InfoOverlay],
  templateUrl: './survey-dialog.html',
  styleUrl: './survey-dialog.scss',
})

export class SurveyDialog {
  surveyForm: SurveyForm;
  readonly surveyService = inject(SurveyService);
  readonly dbService = inject(SupabaseService);
  submitted = this.surveyService.submitted;
  minDate = new Date().toISOString().split('T')[0];
  private readonly renderer = inject(Renderer2);
  private readonly document = inject(DOCUMENT);
  readonly optionCountDialog = signal<number>(0);
  readonly router = inject(Router);
  pendingPublishCleanup = false;
  showDialogOverlay = signal<boolean>(false);
  dialogOverlayMessage = signal<string>('');

  constructor() {
    this.surveyForm = this.createSurveyForm();
  }

  /**
   * This function creates a new survey form with the necessary form controls and validators. It initializes the form with controls for 
   * survey title, description, expiry date, category, and an array of questions. Each control has appropriate validators to ensure that 
   * the input meets the required criteria.
   * @returns The created survey form as a SurveyForm instance.
   */
  private createSurveyForm(): SurveyForm {
    return new FormGroup({
    survey_title: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(3)]
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [
          Validators.minLength(10), 
          Validators.maxLength(500), 
          Validators.pattern('[a-zA-Z0-9äöüÄÖÜ .,!?]*')] 
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
  }
  /**
   * This getter retrieves the questions FormArray from the surveyForm. It allows access to the individual question controls and their values 
   * for the survey dialog.
   * @returns The questions FormArray from the surveyForm.
   */
  get questions(): FormArray<QuestionGroup> {
    return this.surveyForm.controls.questions;
  }

  /**
   * This getter retrieves the form control for the category field of the survey form. It allows access to the value and validation state
   * of the category field.
   * @returns The form control for the category field as a FormControl.
   */
  get formCategory(): FormControl<string> {
    return this.surveyForm.controls.category;
  }

  /**
   * This getter checks if the survey title is invalid. It retrieves the 'survey_title' form control from the survey form,
   * and checks its validity based on whether it has been touched or if the survey has been submitted.
   * @returns A boolean indicating whether the survey title is invalid.
   */
  get surveyTitleInvalid(): boolean {
    const titleControl = this.surveyForm.controls.survey_title;
    return titleControl.invalid && (titleControl.touched || this.submitted());
  }

  /**
   * This getter checks if the survey description is invalid. It retrieves the 'description' form control from the survey form,
   * and checks its validity based on whether it has been touched or if the survey has been submitted.
   * @returns A boolean indicating whether the survey description is invalid.
   */
  get surveyDescriptionInvalid(): boolean {
    const descriptionControl = this.surveyForm.controls.description;
    return descriptionControl.invalid && (descriptionControl.touched || this.submitted());
  }

  /**
   * This function is called when the component is initialized. It adds an initial question to the survey form by calling the addQuestion method.
   */
  ngOnInit() {
    this.addQuestion();
    this.optionCountDialog.set(this.questions.at(0).get('options')?.value.length || 0);
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
  async formSubmit() {
    this.submitted.set(true);
    this.surveyForm.markAllAsTouched();
    if (this.surveyForm.valid) {
      this.dbService.storeAllNewSurveyDetails(this.surveyForm.getRawValue());
      await this.showInfoByOverlay('Your survey is now published!');
      this.closeSurveyCreationDialog();
      this.router.navigate(['/dashboard']);
    }
  }

  /**
   * This function returns an error message for a specific form control based on its validation state. It checks if the control is invalid and 
   * has been touched or submitted, and then returns an appropriate error message based on the type of validation error (required or minlength).
   * If the control is valid or has not been touched/submitted, it returns null.
   * @param controlName The name of the form control for which to get the error message.
   * @returns The error message string or null if the control is valid.
   */
  getInputErrorMessage(controlName: string): string | null {
    const control = this.surveyForm.get(controlName);
    const shouldShow = !!control && (control.touched || this.submitted());
    if (!shouldShow) return null;

    return getValidationMessage(control, controlName);
  }

  /**
   * This function cancels the survey creation process. It closes the survey dialog, resets the survey form to its initial state, and sets the
   * submitted signal to false. This allows users to exit the survey creation process without saving any changes.
   */
  closeSurveyCreationDialog() {
    this.deepResetDialogState();
    this.surveyService.closeSurveyDialog();
    this.renderer.removeClass(this.document.body, 'noscroll');
  }

  /**
   * This function performs a deep reset of the survey dialog state. It resets the survey form to its initial state, adds a new question,
   * sets the submitted signal to false, resets the option count, and clears any overlay messages. It also marks the form as pristine and untouched,
   * ensuring that all form controls are reset to their default values and validation states.
   */
  private deepResetDialogState() {
    this.surveyForm = this.createSurveyForm();
    this.addQuestion();
    this.submitted.set(false);
    this.optionCountDialog.set(2);
    this.pendingPublishCleanup = false;
    this.showDialogOverlay.set(false);
    this.dialogOverlayMessage.set('');
    this.surveyForm.markAsPristine();
    this.surveyForm.markAsUntouched();
    this.surveyForm.updateValueAndValidity({emitEvent: false});
    this.surveyService.selectedCategory.set(null);
  }

  /**
   * This function shows an information overlay with a specific message. It sets the showDialogOverlay signal to true and updates the overlayMessage
   * signal with the provided message. This allows users to see important information or notifications related to the survey dialog.
   * @param message - The message to be displayed in the overlay. 
   */
  async showInfoByOverlay(message: string) {
    this.showDialogOverlay.set(true);
    this.dialogOverlayMessage.set(message);
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, 1400);
    });
  }
}
