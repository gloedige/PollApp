import { Component, Input } from '@angular/core';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';

@Component({
  selector: 'app-question-option',
  imports: [Checkbox],
  templateUrl: './question-option.html',
  styleUrl: './question-option.scss',
})
export class QuestionOption {
  @Input() optionText: string = 'Option text';
  @Input() order_letter: string = 'A';
  @Input() optionId: number = 0;
  @Input() questionId: string = '';
}
  