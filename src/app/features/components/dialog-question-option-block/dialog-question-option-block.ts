import { Component, input, inject, output} from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';
import { FormCheckbox} from "../../../shared/components/form-checkbox/form-checkbox";
import { Button } from '../../../shared/components/button/button';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule, ControlContainer, FormGroupName, Validators } from '@angular/forms';
import { SurveyService } from '../../services/survey-service';
import { getValidationMessage } from '../../../shared/utils/validation-messages.util';

type OptionGroup = FormGroup<{ text: FormControl<string> }>;

@Component({
  selector: 'app-dialog-question-option-block',
  imports: [DialogQuestionOption, FormCheckbox, Button, ReactiveFormsModule],
  templateUrl: './dialog-question-option-block.html',
  styleUrl: './dialog-question-option-block.scss',
  viewProviders: [{provide: ControlContainer, useExisting: FormGroupName}]
})
export class DialogQuestionOptionBlock {
  questionNumber: number = 0;
  questionTitle: string = '';
  order_letter_array: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  readonly maximumNumberOfOptions = 6;
  readonly surveyServiceProvider = inject(SurveyService);

  questionIndex = input<number>(0);
  initialOptionCount = input<number>(0);
  maxOptionCountReached = output<boolean>();
  
  constructor(private controlContainer: ControlContainer) {}

  /**
   * This getter retrieves the current question group from the control container. It casts the control to a FormGroup, allowing access to 
   * the form controls and their values for the current question.
   * @returns The current question group as a FormGroup.
   */
  get currentQuestionGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  /**
   * This getter retrieves the form controls for the options of the current question. It casts the 'options' control to a FormArray, allowing
   * access to the individual option controls and their values for the current question.
   * @returns The form controls for the options of the current question as a FormArray.
   */
  get formOptions(): FormArray<OptionGroup> {
    return (this.currentQuestionGroup.get('options') as FormArray<OptionGroup>);
  }

  /**
   * This getter retrieves the form control for the 'multiple' field of the current question. It casts the 'multiple' control to a FormControl,
   * allowing access to its value and validation state for the current question.
   * @returns The form control for the 'multiple' field of the current question as a FormControl.
   */
  get formMultiple(): FormControl<boolean> {
    return (this.currentQuestionGroup.get('multiple') as FormControl<boolean>);
  }

  /**
   * This getter checks if the question title is invalid. It retrieves the 'title' form control from the current question group,
   * and checks its validity based on whether it has been touched or if the survey has been submitted.
   * @returns A boolean indicating whether the question title is invalid.
   */
  get questionTitleInvalid(): boolean {
    const questionControl = this.currentQuestionGroup.get('title') as FormControl<string>;
    return questionControl ? questionControl.invalid && (questionControl.touched || this.surveyServiceProvider.submitted()) : false;
  }

  /**
   * This getter retrieves the index of the current question within the questions FormArray. It finds the index of the current question group
   * based on its client ID and returns the index. If the question control is not found, it returns -1.
   * @returns The index of the current question within the questions FormArray, or -1 if not found.
   */
  get indexOfCurrentQuestion(): number {
    const questionControl = this.controlContainer.control as FormGroup;
    if (questionControl) {
      const questionIndex = (this.controlContainer as any).formDirective.form.getRawValue().questions.findIndex((q: any) => q.clientId === this.currentQuestionGroup.value.clientId);
      return questionIndex;
    }
    return -1; // Return -1 if the question control is not found
  }

  /**
   * This function adds a new option to the options FormArray of the current question. It checks if the current option count is less than the 
   * maximum number of options allowed. If so, it increments the option count and pushes a new FormGroup for the option to the options array.
   * If the option count reaches the maximum number of options, it emits an event indicating that the maximum option count has been reached.
   * @returns void
   */
  addOption(): void {
    if (this.formOptions.length < this.maximumNumberOfOptions) {
      this.formOptions.push(
        new FormGroup({
          text: new FormControl('', { nonNullable: true, validators: [Validators.required] })
        })
      );
      console.log('count of options in formOptions:', this.formOptions.length);
    }
    if (this.formOptions.length === this.maximumNumberOfOptions) {
      this.maxOptionCountReached.emit(true);
    }
  }

  /**
   * This function retrieves the validation error message for a specific control within the current question group. It checks if the control 
   * is invalid and has been touched or if the survey has been submitted. If so, it returns the appropriate validation message using the 
   * getValidationMessage utility function.
   * @param controlName The name of the control for which to retrieve the error message.
   * @returns The validation error message, or null if the control is valid or has not been touched.
   */
  getInputErrorMessage(controlName: string): string | null {
    const control = this.currentQuestionGroup.get(controlName);
    const shouldShow = !!control && (control.touched || this.surveyServiceProvider.submitted());
    if (!shouldShow) return null;

    return getValidationMessage(control, controlName);
  }

  /**
   * This function removes a question from the questions FormArray based on the provided question index. If the question index is 0, it clears
   * the title of the first question instead of removing it. For other question indices, it removes the corresponding question group from 
   * the FormArray.
   * @param questionIndex - The index of the question to be removed from the questions FormArray.
   * @returns void
   */
  removeQuestion(questionIndex: number): void {
    const questions = (this.controlContainer as any).formDirective.form.get('questions') as FormArray;
    const questionGroup = questions.at(questionIndex) as FormGroup | null;

    if (questionIndex == 0) {
      questionGroup?.get('title')?.setValue('');
      questionGroup?.get('title')?.markAsUntouched();
      return;
    }

    questions.removeAt(questionIndex);
  }
}
