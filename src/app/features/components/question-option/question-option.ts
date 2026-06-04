import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-question-option',
  imports: [],
  templateUrl: './question-option.html',
  styleUrl: './question-option.scss',
})
export class QuestionOption {
  @Input() optionText: string = 'Option text';
  @Input() order_letter: string = 'A';
  @Input() optionId: number = 0;
}
  