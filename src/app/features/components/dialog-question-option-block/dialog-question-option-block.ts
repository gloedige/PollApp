import { Component, signal } from '@angular/core';
import { DialogQuestionOption } from '../dialog-question-option/dialog-question-option';

@Component({
  selector: 'app-dialog-question-option-block',
  imports: [DialogQuestionOption],
  templateUrl: './dialog-question-option-block.html',
  styleUrl: './dialog-question-option-block.scss',
})
export class DialogQuestionOptionBlock {
  questionNumber: number = 0;
  questionTitle: string = '';
  numberOfOptions: number = 1;
  order_letter_array: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  readonly order_letter = signal<string>('A');

  ngOnInit() {
    this.getNextOrderLetter();
  }

  getNextOrderLetter() {
    this.order_letter.set(this.order_letter_array[this.numberOfOptions - 1]);
    this.numberOfOptions++;
  }
}
