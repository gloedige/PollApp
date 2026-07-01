import { Component, input, inject } from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';
import { FormCheckbox} from "../../../shared/components/form-checkbox/form-checkbox";
import { Button } from '../../../shared/components/button/button';
import { FormArray, FormGroup, FormControl, ReactiveFormsModule, ControlContainer, FormGroupName } from '@angular/forms';
import { SurveyService } from '../../services/survey-service';
import { getValidationMessage } from '../../../shared/utils/validation-messages.util';

type QuestionDraft = {
  clientId: string;
  id?: string;
  text: string;
  options: OptionDraft[];
};

type OptionDraft = {
  clientId: string;
  id?: string;
  questionClientId: string;
  questionId?: string;
  text: string;
};

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
  readonly minimumNumberOfOptions = 2;
  readonly nextOptionIndex = this.minimumNumberOfOptions;
  private readonly surveyServiceProvider = inject(SurveyService);

  questionIndex = input<number>(1); // TODO: wird aktuell über questionNumber gesetzt
  
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
    console.log('questionControl:', questionControl);
    return questionControl ? questionControl.invalid && (questionControl.touched || this.surveyServiceProvider.submitted()) : false;
  }

  /**
   * This function adds a new option to the formOptions FormArray. It creates a new FormGroup for the option with a text FormControl and 
   * pushes it to the formOptions array. This allows users to dynamically add options to a question in the survey dialog.
   */
  addOption(): void {
    this.formOptions.push(new FormGroup({
      text: new FormControl('', { nonNullable: true })
    }));
  }

  question: QuestionDraft = {
    clientId: '',
    text: '',
    options: []
  };

  /**
   * This function is called when the component is initialized. It retrieves the next question number, creates a new client ID for 
   * the question, and initializes the default options for the question.
   */
  ngOnInit() {
    this.getNextQuestionNumber();
    this.question.clientId = this.createNewClientId();
    // this.initializeDefaultOptions();
  }

  /**
   * This function generates a new client ID using the crypto.randomUUID() method, which creates a unique identifier for the question. 
   * This ID is used to uniquely identify each question within the survey.
   * @returns A unique client ID for the question.
   */
  createNewClientId() {
    return crypto.randomUUID();
  }

  /**
   * This function initializes the default options for a question. It creates a specified number of options (defined by minimumNumberOfOptions)
   * and adds them to the question's options array. Each option is assigned a unique client ID and is associated with the question's client ID.
   * The text for each option is initialized as an empty string.
    * @returns - void
   */
  initializeDefaultOptions() {
    for (let index = 0; index < this.minimumNumberOfOptions; index++) {
      const newOption: OptionDraft = {
        clientId: this.createNewClientId(),
        questionClientId: this.question.clientId,
        text: ''
      };
      this.question.options.push(newOption);
    }
  }

  /**
   * This function increments the question number and returns the next question number.
   * @returns The next question number.
   */
  getNextQuestionNumber() {
    this.questionNumber++;
    return this.questionNumber;
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
}
