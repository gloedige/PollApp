import { Component } from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';
import { Checkbox } from "../../../shared/components/checkbox/checkbox";
import { Button } from '../../../shared/components/button/button';

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

  question: QuestionDraft = {
    clientId: '',
    text: '',
    options: []
  };

  ngOnInit() {
    this.getNextQuestionNumber();
    this.question.clientId = this.createNewClientId();
    this.initializeDefaultOptions();
  }

  createNewClientId() {
    return crypto.randomUUID();
  }

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

  addOption() {
    const newOption: OptionDraft = {
      clientId: this.createNewClientId(),
      questionClientId: this.question.clientId,
      text: ''
    };
    this.question.options.push(newOption);
  }

  getNextQuestionNumber() {
    this.questionNumber++;
    return this.questionNumber;
  }
}
