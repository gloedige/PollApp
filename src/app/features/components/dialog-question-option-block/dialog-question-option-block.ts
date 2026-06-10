import { Component, signal } from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';
import { NgClass } from "//Repositorium_V2/home/Dokumente_Gerd/Transformation Softwareentwickler/Webdeveloper/Projects/Poll_App/node_modules/@angular/common/types/_common_module-chunk";
import { Checkbox } from "../../../shared/components/checkbox/checkbox";

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
  imports: [DialogQuestionOption, Checkbox],
  templateUrl: './dialog-question-option-block.html',
  styleUrl: './dialog-question-option-block.scss',
})
export class DialogQuestionOptionBlock {
  questionNumber: number = 0;
  questionTitle: string = '';
  numberOfOptions: number = 1;
  order_letter_array: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  readonly order_letter = signal<string>('A');

  question: QuestionDraft = {
    clientId: '',
    text: '',
    options: []
  };
  option: OptionDraft = {
    clientId: '',
    questionClientId: '',
    text: ''
  };
  questionOptions: OptionDraft[] = [];

  ngOnInit() {
    this.getNextOrderLetter();
    this.getNextQuestionNumber();
    this.question.clientId = this.createNewClientId();
  }

  getNextOrderLetter() {
    this.order_letter.set(this.order_letter_array[this.numberOfOptions - 1]);
    this.numberOfOptions++;
  }

  createNewClientId() {
    return crypto.randomUUID();
  }

  addOption() {
    const newOption: OptionDraft = {
      clientId: this.createNewClientId(),
      questionClientId: this.question.clientId,
      text: ''
    };
    this.question.options.push(newOption);
    this.getNextOrderLetter();
  }

  getNextQuestionNumber() {
    this.questionNumber++;
    return this.questionNumber;
  }
}
