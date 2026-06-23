import { Component, input } from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';
import { Checkbox } from "../../../shared/components/checkbox/checkbox";
import { Button } from '../../../shared/components/button/button';
import { FormArray, FormGroup, FormControl } from '@angular/forms';

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

type QuestionGroup = FormGroup<{
  title: FormControl<string>;
  multiple: FormControl<boolean>;
  options: FormArray<OptionGroup>;
}>;

@Component({
  selector: 'app-dialog-question-option-block',
  imports: [DialogQuestionOption, Checkbox, Button],
  templateUrl: './dialog-question-option-block.html',
  styleUrl: './dialog-question-option-block.scss',
})
export class DialogQuestionOptionBlock {
  questionNumber: number = 0;
  questionTitle: string = '';
  order_letter_array: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  readonly minimumNumberOfOptions = 2;
  readonly nextOptionIndex = this.minimumNumberOfOptions;

  questionGroup = input.required<QuestionGroup>();
  questionIndex = input<number>(1); // TODO: wird aktuell über questionNumber gesetzt

  get options(): FormArray<OptionGroup> {
    return this.questionGroup().controls.options;
  }

  addOption(): void {
    this.options.push(new FormGroup({
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
    this.initializeDefaultOptions();
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
}
