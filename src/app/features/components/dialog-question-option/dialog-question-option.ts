import { Component, inject, input} from '@angular/core';
import { ControlContainer, FormGroupName, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { getValidationMessage } from '../../../shared/utils/validation-messages.util';
import { SurveyService } from '../../services/survey-service';

@Component({
  selector: 'app-dialog-question-option',
  imports: [ReactiveFormsModule],
  templateUrl: './dialog-question-option.html',
  styleUrl: './dialog-question-option.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupName }]
})
export class DialogQuestionOption {
  order_letter = input<string>('A');
  optionIndex = input.required<number>();
  questionIndex = input.required<number>();
  private readonly surveyServiceProvider = inject(SurveyService);

  constructor(private controlContainer: ControlContainer) {}

  /**
   * This getter retrieves the current option group FormGroup from the control container. It allows access to the individual option controls and their values
   * for the dialog question option component.
   * @returns The current option group FormGroup.
   */
  get currentOptionGroup(): FormGroup {
    return this.controlContainer.control as FormGroup;
  }

  /**
   * This getter checks if the option text is invalid. It retrieves the 'text' form control from the current option group,
   * and checks its validity based on whether it has been touched or if the survey has been submitted.
   * @returns A boolean indicating whether the option text is invalid.
   */
  get optionTextInvalid(): boolean {
    const optionControl = this.currentOptionGroup.get('text') as FormControl<string>;
    return optionControl ? optionControl.invalid && (optionControl.touched || this.surveyServiceProvider.submitted()) : false;
  }

  /**
   * This function retrieves the validation error message for a specific control within the current option group. It checks if the control 
   * is invalid and has been touched or if the survey has been submitted. If so, it returns the appropriate validation message using the 
   * getValidationMessage utility function.
   * @param controlName The name of the control for which to retrieve the error message.
   * @returns The validation error message, or null if the control is valid or has not been touched.
   */
  getInputErrorMessage(controlName: string): string | null {
    const control = this.currentOptionGroup.get(controlName);
    const shouldShow = !!control && (control.touched || this.surveyServiceProvider.submitted());
    if (!shouldShow) return null;
    return getValidationMessage(control, controlName);
  }
}
